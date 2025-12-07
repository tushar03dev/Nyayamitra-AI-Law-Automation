import { Router } from "express";
import {
    signUp,
    signIn,
    passwordReset,
    changePassword, googleLogin, completeSignUp, googleCallback
} from "../controllers/authController";

const router = Router();

// User sign-up
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/verify", completeSignUp);
router.post("/password-reset", passwordReset);
router.post("/change-password", changePassword);
router.get("/google", googleLogin);
router.get("/google/callback",googleCallback);

export default router;