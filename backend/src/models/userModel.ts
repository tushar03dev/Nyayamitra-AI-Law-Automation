import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string | null;
    role: 'admin' | 'lawyer' | 'junior_lawyer';
    organizationId?: mongoose.Types.ObjectId;
    avatar?: string;
    phone?: string;
    authProvider?: 'google' | 'apple' | 'local';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    role: {
        type: String,
        enum: ['admin', 'lawyer', 'junior_lawyer'],
        default: 'junior_lawyer'
    },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    avatar: String,
    phone: String,
    authProvider: {
        type: String,
        enum: ["google", "apple", "local"],
        default: "local"
    }
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);