import express from 'express';
import {Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors';
import {authConsumer} from "./consumers/authConsumer";
import {connectRedis} from "./config/redis";

const env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
connectDB().then(async ()=> {
    await authConsumer();
    await connectRedis()
        .then( async() => {
        const authRoutes = (await import('./routes/authRoutes')).default;
        const caseRoutes = (await import('./routes/caseRoutes')).default;
        const hearingRoutes = (await import('./routes/hearingRoutes')).default;
        const dashboardRoutes = (await import('./routes/dashboardRoutes')).default;

        app.use('/auth', authRoutes);
        app.use('/cases', caseRoutes);
        app.use('/hearings', hearingRoutes);
        app.use('/dashboard', dashboardRoutes);
        }
    );
});

//Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Request Payload :", req);
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});