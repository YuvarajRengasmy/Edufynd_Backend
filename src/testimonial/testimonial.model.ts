import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'

export interface TestimonialDocument extends mongoose.Document {
    typeOfUser?: string;
    userName?: any[];
    userEmail?: any[];
    courseOrUniversityName?: string;
    location?: string;
    content?: string;
    uploadFile?:any[];
    hostName?: string;
    staffId?: any;
    staffName?: string;
    counselorName?: string;
    isActive?: string;
   
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const testimonialSchema = new mongoose.Schema({
    typeOfUser: {type: String},
    userName: [String],
    userEmail: [String],
    courseOrUniversityName: {type: String},
    location: {type: String},
    content: {type: String},
    uploadFile: [{fileName: { type: String}, uploadImage: { type: String} }],
    counselorName: {type: String},
    hostName:{type: String},
    isActive: {type: String,default: "InActive"},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    staffName: { type: String},
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

LoggingMiddleware(testimonialSchema)
export const Testimonial = mongoose.model("Testimonial", testimonialSchema)