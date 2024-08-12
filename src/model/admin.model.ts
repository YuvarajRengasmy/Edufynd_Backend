import * as mongoose from 'mongoose'


export interface AdminDocument extends mongoose.Document{
    _id?: any;
    name?: string;
    adminCode?: string;
    email?: string;
    mobileNumber?: number;  
    password?: string;
    confirmPassword?: string;
    role?:string;
    studentId?: any;
    agentId?: any;
    universityId?: any;
    programId?: any;
    resetOtp?: string;
    resetOtpExpires?: number;  
    notificationId?: any;

    isDeleted?: boolean;
    privileges?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const adminSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
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
    resetOtpExpires: { type: Number },
    notificationId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
    isDeleted: { type: Boolean, default: false },
    privileges: {type: String},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Admin = mongoose.model("Admin", adminSchema)
