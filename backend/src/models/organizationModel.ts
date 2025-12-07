import * as mongoose from "mongoose";

export interface IOrganization extends mongoose.Document {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    logo?: string;
    subscription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrganizationSchema = new mongoose.Schema<IOrganization>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    logo: String,
    subscription: { type: String, default: 'free' }
}, {
    timestamps: true
});

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);