import * as mongoose from "mongoose";

export interface IEvent extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    clientName?: string;
    description?: string;
    location?: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new mongoose.Schema<IEvent>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    clientName: String,
    description: String,
    location: String,
    date: { type: Date, required: true }
}, {
    timestamps: true
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);