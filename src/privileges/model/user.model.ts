import * as mongoose from 'mongoose';

export interface Privilege {
    module: string;
    permissions: {
        add: boolean;
        edit: boolean;
        view: boolean;
        delete: boolean;
        approve: boolean;
    };
}

export interface UserDocument extends mongoose.Document {
    userId?: string;
    name: string;
    email: string;
    role: string;
    status?: string;
    privileges: Privilege[];
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const privilegeSchema = new mongoose.Schema({
    module: { type: String}, // e.g., "Client", "University", etc.
    permissions: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }, // Not applicable for Admin, only for Super Admin
        approve: { type: Boolean, default: false }, // For modules that need approval
    },
});

const userSchema = new mongoose.Schema({
    userId: { type: String },
    name: { type: String,},
    email: { type: String},
    role: { type: String, enum: ['superAdmin', 'admin', 'staff', 'student', 'agent'] },
    status: { type: String },
    privileges: { type: [privilegeSchema], default: [] }, // Array of privileges per module
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});

export const User = mongoose.model("User", userSchema)
