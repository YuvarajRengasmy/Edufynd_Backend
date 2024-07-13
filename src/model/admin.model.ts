import * as mongoose from 'mongoose'


export interface AdminDocument extends mongoose.Document{
    name?: string;
    adminCode?: string;
    email?: string;
    mobileNumber?: number;    //a
    password?: string;
    confirmPassword?: string;
    role?:string;
    studentId?: any;
    agentId?: any;
    universityId?: any;
    programId?: any;
    resetOtp?: string;
    resetOtpExpires?: string;  //a

    isDeleted?: boolean;
    privileges?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const adminSchema = new mongoose.Schema({
    name: {type: String},
    adminCode: {type: String},
    email: { type: String},
    mobileNumber: {type: Number},   
    password: {type: String},
    confirmPassword: {type: String},
    role: {type: String},
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    universityId: {type: mongoose.Types.ObjectId, ref: 'University'},
    programId: { type: mongoose.Types.ObjectId, ref : 'Program'},
    resetOtp: { type: String },
    resetOtpExpires: { type: String },

    isDeleted: { type: Boolean, default: false },
    privileges: {type: String},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Admin = mongoose.model("Admin", adminSchema)
