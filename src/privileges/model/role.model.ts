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

export interface RoleDocument extends mongoose.Document {
    roleName: string;
    privileges: Privilege[];
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const privilegeSchema = new mongoose.Schema({
    module: { type: String, required: true }, // e.g., "Client", "University", etc.
    permissions: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }, // Not applicable for Admin, only for Super Admin
        approve: { type: Boolean, default: false }, // For modules that need approval
    },
});

const roleSchema = new mongoose.Schema({
    roleName: { type: String, required: true }, // e.g., "Super Admin", "Admin"
    privileges: { type: [privilegeSchema], default: [] }, // Array of privileges per module
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});

export const Role = mongoose.model("Role", roleSchema)
