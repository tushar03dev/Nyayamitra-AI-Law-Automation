import * as mongoose from "mongoose";

export interface ICase extends mongoose.Document {
    organizationId: mongoose.Types.ObjectId;
    title: string;
    caseNumber: string;
    clientNames: string[];
    description?: string;
    status: 'active' | 'pending' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    assignedLawyers: mongoose.Types.ObjectId[];
    assignedJuniors: mongoose.Types.ObjectId[];
    nextHearingDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CaseSchema = new mongoose.Schema<ICase>({
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    title: { type: String, required: true },
    caseNumber: { type: String, required: true },
    clientNames: [{ type: String }],
    description: String,
    status: {
        type: String,
        enum: ['active', 'pending', 'resolved', 'closed'],
        default: 'active'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    assignedLawyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    assignedJuniors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    nextHearingDate: Date
}, {
    timestamps: true
});

export const Case = mongoose.model<ICase>('Case', CaseSchema);