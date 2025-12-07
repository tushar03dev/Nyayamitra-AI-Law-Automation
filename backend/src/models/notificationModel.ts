import * as mongoose from "mongoose";

export interface INotification extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['info', 'warning', 'success', 'error'],
        default: 'info'
    },
    isRead: { type: Boolean, default: false }
}, {
    timestamps: true
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);