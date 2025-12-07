import * as mongoose from "mongoose";

export interface IMessage extends mongoose.Document {
    caseId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    message: string;
    attachments?: string[];
    timestamp: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>({
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }],
    timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);