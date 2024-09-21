import * as mongoose from 'mongoose'



export interface TestimonialDocument extends mongoose.Document {
    typeOfUser?: string;
    userName?: any[];
    userEmail?: any[];
    courseOrUniversityName?: string;
    location?: string;
    content?: string;
    uploadFile?:any[];
    hostName?: string;

    counselorName?: string;

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
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Testimonial = mongoose.model("Testimonial", testimonialSchema)