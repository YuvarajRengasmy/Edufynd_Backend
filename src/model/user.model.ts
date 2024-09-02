import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
    userId?: string;
    name: string;
    email: string;
    role: mongoose.Schema.Types.ObjectId; // Reference to Role
    status?: string;
    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const userSchema = new mongoose.Schema({
    userId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }, // Reference to Role
    status: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});


export const User = mongoose.model('User', userSchema)