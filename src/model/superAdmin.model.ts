import * as mongoose from 'mongoose'


export interface SuperAdminDocument extends mongoose.Document{
    _id?: any;
    name?: string;
    photo?: string;
    email?: string;
    mobileNumber?: number;   //a
    password?: string;
    confirmPassword?: string;
    studentId?: any;
    agentId?: any;
    recoveryEmail?: string;
    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const superAdminSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: {type: String},
    email: { type: String},
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
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema)
export default SuperAdmin