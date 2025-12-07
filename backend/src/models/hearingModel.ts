import * as mongoose from "mongoose";

export interface IHearing extends mongoose.Document {
    caseId: mongoose.Types.ObjectId;
    date: Date;
    time: string;
    location?: string;
    judge?: string;
    notes?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
    createdAt: Date;
    updatedAt: Date;
}

const HearingSchema = new mongoose.Schema<IHearing>({
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: String,
    judge: String,
    notes: String,
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'postponed'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

export const Hearing = mongoose.model<IHearing>('Hearing', HearingSchema);