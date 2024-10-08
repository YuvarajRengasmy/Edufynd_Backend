import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'


export interface AdminDocument extends mongoose.Document{
    _id?: any;
    superAdminId?:any;
    staffId?: any;
  staffName?: string;
    name?: string;
    dial1?: string;
    adminCode?: string;
    email?: string;
    dial?: string;
    mobileNumber?: number;  
    password?: string;
    confirmPassword?: string;
    role?:string;
    privileges?: any[];
    studentId?: any;
    agentId?: any;
    universityId?: any;
    programId?: any;
    resetOtp?: string;
    resetOtpExpires?: number;  

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

const adminSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    name: {type: String},
    adminCode: {type: String},
    dial1: {type: String},  
    email: { type: String},
    dial:{type: String},
    mobileNumber: {type: Number},   
    password: {type: String},
    confirmPassword: {type: String},
    role: { type: String},
    privileges: [privilegeSchema],
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    universityId: {type: mongoose.Types.ObjectId, ref: 'University'},
    programId: { type: mongoose.Types.ObjectId, ref : 'Program'},
    resetOtp: { type: String },
    resetOtpExpires: { type: Number },
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    staffName: { type: String},
    isDeleted: { type: Boolean, default: false },
    isActive: {type: String,default: "InActive"},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


LoggingMiddleware(adminSchema)
export const Admin = mongoose.model("Admin", adminSchema)
