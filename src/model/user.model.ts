import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
    _id?: any;
    userId?: any;
    name?: string;
    role?: string;
    status?: string; 

    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    userId: {type: String},
    name: {type: String},
    role: {type: String},
    status: {type: String},
    
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const User = mongoose.model('User', userSchema)