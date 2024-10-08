import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'


export interface ProgramDocument extends mongoose.Document {
    _id?: any;
    programCode?: string;
    superAdminId?: any;
    appliedStudentId?: any;
    universityId?: any;
    universityName?: string;
    universityLogo?: string;
    country?: string;
    courseType?: string;
    programTitle?: string;
    applicationFee?: number;   
    currency?: string;
    flag?: string;
    popularCategories?: string;
    campuses?: any[];
    englishlanguageTest?: string;
    textBox?: string;
    universityInterview?: string;
    greGmatRequirement?: string;
    score?: string;
    academicRequirement?: string;
    commission?: string;
    isDeleted?: boolean;
    isActive?: string;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;


}

const programSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    programCode: {type: String},
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    appliedStudentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    universityName: { type: String }, 
    universityLogo: { type: String },
    country: { type: String },
    programTitle: { type: String },
    applicationFee: { type: Number },
    currency: { type: String },
    flag: { type: String },
    courseType: {type: String},  
    campuses: [{
        campus: { type: String },
        inTake: { type: String },
        duration: { type: String },
        courseFees: { type: String }
    }],
    popularCategories: {type: String},
    englishlanguageTest: { type: String },   
    textBox: { type: String },
    universityInterview: { type: String },   
    greGmatRequirement: { type: String },  
    score: { type: String },
    academicRequirement: { type: String },     
    commission: { type: String },          
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    isActive: {type: String,default: "InActive"},
    createdOn: { type: Date, default: new Date()},
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})


LoggingMiddleware(programSchema)
export const Program = mongoose.model("Program", programSchema)

