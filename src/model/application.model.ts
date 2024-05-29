import * as mongoose from 'mongoose'


export interface ApplicantDocument extends mongoose.Document {
    applicationCode?: string //(Student Code / Number Series)
    studentName?: string,        //(Auto Fetch from Students)
    dob?: string,             //(Auto Fetch from Students)
    passportNo?: string,       // (Auto Fetch from Students)
    email?: string,         //(Auto Fetch from Students)
    primaryNumber?: string,
    whatsAppNumber?: string,
    selectCourse?: any,
    anyVisaRejections?: string,  // (Auto Fetch from Students)
    feesPaid?: string,
    assignTo?: string,
    isDeleted?: boolean;
    status?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const applicantSchema = new mongoose.Schema({
    applicationCode: {type: String},    
    studentID: { type: mongoose.Types.ObjectId, ref: 'Student' }, 
    universityID : { type: mongoose.Types.ObjectId, ref: 'University' },       
    dob:{ type: String, ref: 'Student' },              
    passportNo: { type: String, ref: 'Student' },      
    email:{ type: String, ref: 'Student' },       
    primaryNumber: { type: String, ref: 'Student' }, 
    whatsAppNumber: { type: String, ref: 'Student' }, 
    selectCourse: {
        inTake: {type: String},
        universityID : { type: mongoose.Types.ObjectId, ref: 'University' }, 
        course: {type: String},
        courseFees: {type: String}        // (Auto fetch from Program)
    },
    anyVisaRejections: { type: String, ref: 'Student' }, 
    feesPaid: {type: String},
    assignTo: {type: String},
    isDeleted: { type: Boolean, default: false },
    status: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Applicant = mongoose.model("Applicant", applicantSchema)