import * as mongoose from 'mongoose'


export interface ApplicantDocument extends mongoose.Document {
    applicationCode?: string //(Student Code / Number Series)
    universityId?: any;
    studentId?:any;
    name?: string,        //(Auto Fetch from Students)
    dob?: string,             //(Auto Fetch from Students)
    passportNo?: string,       // (Auto Fetch from Students)
    email?: string,         //(Auto Fetch from Students)
    primaryNumber?: string,
    whatsAppNumber?: string,
    inTake?: string,
    universityName?: string,
    course?: string,
    courseFees?: string,
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
    applicationCode: { type: String },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    name: {type: String, ref: 'Student'},
    dob: { type: String, ref: 'Student' },
    passportNo: { type: String, ref: 'Student' },
    email: { type: String, ref: 'Student' },
    primaryNumber: { type: String, ref: 'Student' },
    whatsAppNumber: { type: String, ref: 'Student' },
    inTake: { type: String },
    universityName: { type: String, ref: 'University' },
    course: { type: String },
    courseFees: { type: String },       // (Auto fetch from Program)
    anyVisaRejections: { type: String, ref: 'Student' },
    feesPaid: { type: String },
    assignTo: { type: String },

    isDeleted: { type: Boolean, default: false },
    status: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Applicant = mongoose.model("Applicant", applicantSchema)