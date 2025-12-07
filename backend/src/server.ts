import express from 'express';
import {Request, Response, NextFunction} from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors';
import {authConsumer} from "./consumers/authConsumer";
import {connectRedis} from "./config/redis";

const env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});

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
        const messageRoutes = (await import('./routes/messageRoutes')).default;

        app.use('/auth', authRoutes);
        app.use('/cases', caseRoutes);
        app.use('/hearings', hearingRoutes);
        app.use('/dashboard', dashboardRoutes);
        app.use('/messages', messageRoutes);
        }
    );
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-case', (caseId: string) => {
        socket.join(`case-${caseId}`);
        console.log(`User ${socket.id} joined case ${caseId}`);
    });

    socket.on('leave-case', (caseId: string) => {
        socket.leave(`case-${caseId}`);
        console.log(`User ${socket.id} left case ${caseId}`);
    });

    socket.on('message', async (data: { caseId: string; message: string; senderId: string; senderName: string; timestamp: string }) => {
        try {
            // Save message to database
            const { Message } = await import('./models/messageModel');
            const newMessage = new Message({
                caseId: data.caseId,
                senderId: data.senderId,
                message: data.message,
                timestamp: new Date(data.timestamp),
            });
            await newMessage.save();

            // Populate sender info
            await newMessage.populate('senderId', 'firstName lastName email');

            // Emit to all users in the case room
            io.to(`case-${data.caseId}`).emit('message', {
                id: newMessage._id.toString(),
                caseId: newMessage.caseId.toString(),
                senderId: newMessage.senderId.toString(),
                senderName: data.senderName,
                message: newMessage.message,
                timestamp: newMessage.timestamp.toISOString(),
            });
        } catch (error) {
            console.error('Error handling message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

//Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Request Payload :", req);
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});