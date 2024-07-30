import mongoose,{Types} from 'mongoose';
import { DateTime } from "luxon";

export interface chatMessageDocument extends mongoose.Document{
    _id?: any;
    superAdminId?: Types.ObjectId;
    staffId?:Types.ObjectId;
    studentId?:Types.ObjectId;
    // agentId?:Types.ObjectId;
    // adminId?:Types.ObjectId;
     message?:String;
    sentOn?: any;
    senderType?: String;
    isSeen: boolean;
    isDeleted?: Boolean;
    status?: Number;
    createdOn?: Date;
    createdBy?: String;
    modifiedOn?: Date;
    modifiedBy?: String ; 
  
}

const chatMessageSchema = new mongoose.Schema({
    
    _id: { type: Types.ObjectId, required: true, auto: true },
    superAdminId: { type: Types.ObjectId, required: true, ref: 'SuperAdmin' },
    staffId:{ type: Types.ObjectId,required: true, ref: 'Staff' },
    studentId:{type: Types.ObjectId,required: true, ref: 'Student' },
    // agentId:{ type: Types.ObjectId,required: true, ref: 'Agent' },
    // adminId:{ type: Types.ObjectId,required: true, ref: 'Admin' },
    message: { type: String, required: true },
    sentOn: { type: String,default:DateTime.utc().setZone('Asia/Kolkata').toFormat('HH:mm') },
    senderType: { type: String },
    isSeen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date,default: Date.now },
    createdAt: { type: Date, default: Date.now, index: true },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})
export const ChatMessage = mongoose.model('chat',chatMessageSchema);
