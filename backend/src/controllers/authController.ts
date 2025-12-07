import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/userModel';
import dotenv from 'dotenv';
import {passwordResetMail, sendOTP} from "./otpController";
import {publishToQueue} from "../config/rabbitmq";
import {getRedisClient} from '../config/redis';
import {signUpPayload} from "../types/signUp";
import {completeSignUpPayload} from "../types/completeSignup";
import {signInPayload} from "../types/signIn";
import {emailOnlyPayload} from "../types/passwordReset";
import {changePasswordPayload} from "../types/changePassword";
import { flattenZodError } from '../utils/validation';
import zod from 'zod';

const env = process.env.NODE_ENV;
dotenv.config({path: `.env.${env}`});

// -------------------------------------------------------------
// SIGN UP
// -------------------------------------------------------------

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("SIGNUP REQUEST RECEIVED");
    console.log("Payload:", req.body);

    const createPayload = req.body;
    const parsedPayload = signUpPayload.safeParse(createPayload);

    if(!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", flattenZodError(parsedPayload.error));
        res.json({ message: "Invalid input", errors: flattenZodError(parsedPayload.error) });
        return;
    }

    try {
        console.log("Checking if user exists:", createPayload.email);
        const existingUser = await User.findOne({email: createPayload.email});

        if (existingUser) {
            console.log("User already exists:", existingUser.email);
            res.status(400).json({ errors: 'USER_ALREADY_EXISTS' });
            return;
        }

        console.log("Generating OTP for:", createPayload.email);
        const otp = await sendOTP(createPayload.email);

        if (!otp) {
            console.log("OTP generation failed");
            res.status(400).json({errors : 'Otp Not Found'});
            return;
        }

        console.log("Storing OTP and temp user data in Redis");
        const redisClient = getRedisClient();
        await redisClient.setEx(`otp:${createPayload.email}`, 300, otp);
        await redisClient.setEx(
            `signup:${createPayload.email}`,
            300,
            JSON.stringify({name: createPayload.name, password: createPayload.password})
        );

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email. Please enter the OTP to complete sign-up.'
        });

    } catch (err) {
        console.log("SIGNUP ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// COMPLETE SIGN UP
// -------------------------------------------------------------

export const completeSignUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("COMPLETE SIGNUP REQUEST RECEIVED");
    console.log("Payload:", req.body);

    const parsedPayload = completeSignUpPayload.safeParse(req.body);

    if(!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", parsedPayload.error);
        const errorTree = zod.treeifyError(parsedPayload.error);
        res.status(401).json({ message: "Invalid input", errors: errorTree });
        return;
    }

    try {
        const redisClient = getRedisClient();

        console.log("Fetching saved OTP for:", req.body.email);
        const savedOtp = await redisClient.get(`otp:${req.body.email}`);
        console.log("Saved OTP:", savedOtp);

        if (savedOtp && req.body.otp === savedOtp) {

            console.log("OTP matched. Fetching temp user data");
            const userDataStr = await redisClient.get(`signup:${req.body.email}`);

            if (!userDataStr) {
                console.log("No user data found in Redis");
                res.status(400).json({message: 'No user data found or token expired.'});
                return;
            }

            const {name, password} = JSON.parse(userDataStr);
            console.log("Temp user data retrieved");

            console.log("Publishing to RabbitMQ");
            await publishToQueue("authQueue", {name, email: req.body.email, password});

            console.log("Deleting Redis temp data");
            await redisClient.del([`signup:${req.body.email}`, `otp:${req.body.email}`]);

            const token = jwt.sign(
                {email: req.body.email},
                process.env.JWT_SECRET as string,
                {expiresIn: "1d"}
            );
            console.log("JWT generated");

            res.status(201).json({success: true, token, message: 'User signed up successfully.'});
        } else {
            console.log("OTP mismatch");
            res.status(400).json({message: 'Invalid or expired otp'});
        }

    } catch (err) {
        console.log("COMPLETE SIGNUP ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// SIGN IN
// -------------------------------------------------------------

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    console.log("SIGNIN REQUEST RECEIVED");
    console.log("Payload:", req.body);

    const parsedPayload = signInPayload.safeParse(req.body);

    if(!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", parsedPayload.error);
        const errorTree = zod.treeifyError(parsedPayload.error);
        res.status(401).json({ message: "Invalid input", errors: errorTree });
        return;
    }

    try {
        console.log("Finding user:", req.body.email);
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            console.log("User not found");
            res.status(400).send('User does not exist.');
            return;
        }

        if(user.password == null){
            console.log("User uses third-party authentication");
            res.status(400).send('User logged in through different authentication.');
            return;
        }

        console.log("Checking password");
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            console.log("Invalid password");
            res.status(400).send('Invalid password');
            return;
        }

        console.log("Password valid. Generating JWT");
        const token = jwt.sign(
            {email: user.email},
            process.env.JWT_SECRET as string,
            {expiresIn: '1d'}
        );

        res.json({success: true, token, name: `${user.firstName} ${user.lastName}`});

    } catch (err) {
        console.log("SIGNIN ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// PASSWORD RESET
// -------------------------------------------------------------

export const passwordReset = async (req: Request, res: Response, next: NextFunction) => {
    console.log("PASSWORD RESET REQUEST RECEIVED");
    console.log("Payload:", req.body);

    const parsedPayload = emailOnlyPayload.safeParse(req.body);

    if(!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", parsedPayload.error);
        const errorTree = zod.treeifyError(parsedPayload.error);
        res.status(401).json({ message: "Invalid input", errors: errorTree });
        return;
    }

    try {
        console.log("Checking if user exists");
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            console.log("User not found");
            res.status(400).json({msg: 'User does not exist.'});
            return;
        }

        console.log("Generating OTP for password reset");
        const otp = await passwordResetMail(req.body.email);

        console.log("Storing OTP in Redis");
        const redisClient = getRedisClient();
        await redisClient.setEx(`otp:${req.body.email}`, 300, otp);

        res.status(201).json({success: true, msg: 'Otp verification mail sent.'});

    } catch (err) {
        console.log("PASSWORD RESET ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// CHANGE PASSWORD
// -------------------------------------------------------------

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    console.log("CHANGE PASSWORD REQUEST RECEIVED");
    console.log("Payload:", req.body);

    const parsedPayload = changePasswordPayload.safeParse(req.body);

    if(!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", parsedPayload.error);
        const errorTree = zod.treeifyError(parsedPayload.error);
        res.status(401).json({ message: "Invalid input", errors: errorTree });
        return;
    }

    try {
        const redisClient = getRedisClient();

        console.log("Fetching OTP from Redis");
        const savedOtp = await redisClient.get(`otp:${req.body.email}`);
        console.log("Saved OTP:", savedOtp);

        if (savedOtp && req.body.otp === savedOtp) {
            console.log("OTP matched. Updating password");

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await User.updateOne({email: req.body.email}, {password: hashedPassword});

            console.log("Password updated. Deleting OTP from Redis");
            await redisClient.del(`otp:${req.body.email}`);

            res.status(200).json({success: true, msg: 'Password updated'});
        } else {
            console.log("Invalid or expired OTP");
            res.status(400).send('Invalid or Expired OTP');
        }

    } catch (err) {
        console.log("CHANGE PASSWORD ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// GOOGLE LOGIN / SIGNUP
// -------------------------------------------------------------

export const googleSave = async(req: Request, res: Response, next: NextFunction) => {
    console.log("GOOGLE AUTH REQUEST RECEIVED");
    console.log("Payload:", req.body);

    try {
        const { email, name, picture } = req.body;

        console.log("Looking for user:", email);
        let user = await User.findOne({ email });

        if (!user) {
            console.log("User not found. Creating new Google user");
            user = new User({
                email,
                name,
                picture,
                password: null,
                authProvider: "google",
            });

            await user.save();
            console.log("New user saved:", user._id.toString());
        } else {
            console.log("Existing user found:", user._id.toString());
        }

        console.log("Generating JWT for Google user");
        const token = jwt.sign(
            { id: (user._id as any).toString(), email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        console.log("JWT generated successfully");
        res.json({success: true, token, user});

    } catch (error) {
        console.log("GOOGLE AUTH ERROR:", error);
        res.status(500).send("Google authentication failed");
    }
};
