import * as mongoose from 'mongoose'


export interface SuperAdminDocument extends mongoose.Document{
    _id?: any;
    name?: string;
    photo?: string;
    email?: string;
    dial?: string;
    mobileNumber?: number;  
    password?: string;
    confirmPassword?: string;
    studentId?: any;
    agentId?: any;
    recoveryEmail?: string;
    role?: string;
    privileges?: any[];
    isDeleted?: boolean;
    isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const privilegeSchema = new mongoose.Schema({
    module: { type: String}, // e.g., 'University', 'Program', 'Client'
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    view: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    });

const superAdminSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: {type: String},
    email: { type: String},
    dial: {type: String},
    mobileNumber: {type: Number},
    photo: {type: String},
    password: {type: String},
    confirmPassword: {type: String},
    recoveryEmail: {type: String},
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    adminId: { type: mongoose.Types.ObjectId, ref: 'Admin' },
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff' },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },

    role: { type: String, enum: ['superAdmin', 'admin', 'staff', 'student', 'agent'] },
    privileges: [privilegeSchema],

    isDeleted: { type: Boolean, default: false },
    isActive: {type: String,default: "InActive"},
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema)
export default SuperAdmin