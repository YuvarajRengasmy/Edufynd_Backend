import * as mongoose from 'mongoose'


export interface AdminDocument extends mongoose.Document{
    name?: string;
    adminCode?: string;
    email?: string;
    mobileNumber?: string;
    password?: string;
    confirmPassword?: string;
    role?:string;
    isDeleted?: boolean;

    resetOtp?: string;
    resetOtpExpires?: number;
    
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
    mobileNumber: {type: String},
    password: {type: String},
    confirmPassword: {type: String},
    role: {type: String},


    resetOtp: { type: String },
    resetOtpExpires: { type: Number },

    isDeleted: { type: Boolean, default: false },
    privileges: {type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Admin = mongoose.model("Admin", adminSchema)
