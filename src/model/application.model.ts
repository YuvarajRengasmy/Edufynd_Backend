import * as mongoose from 'mongoose'


export interface ApplicantDocument extends mongoose.Document {
    _id?: any;
    applicationCode?: string;
    universityId?: any;
    studentId?:any;
    name?: string,       
    dob?: string,           
    passportNo?: string,      
    email?: string,        
    primaryNumber?: number,  
    whatsAppNumber?: number,  
    inTake?: string,
    country?: string;
    universityName?: string,
    course?: string,
    campus?: string,
    courseFees?: number,
    anyVisaRejections?: string, 
    feesPaid?: string,
    assignTo?: string,
    commentBox?: string;
    programTitle?: string;
    isDeleted?: boolean;
    status?: any;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const applicantSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    applicationCode: { type: String },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    name: {type: String, ref: 'Student'},
    dob: { type: String, ref: 'Student' },
    passportNo: { type: String, ref: 'Student' },
    email: { type: String, ref: 'Student' },
    primaryNumber: { type: Number, ref: 'Student' },
    whatsAppNumber: { type: Number, ref: 'Student' },
    inTake: { type: String },
    country: {type: String},
    universityName: { type: String, ref: 'University' },
    campus: {type: String},
    course: { type: String },
    courseFees: { type: Number },       
    anyVisaRejections: { type: String, ref: 'Student' },
    feesPaid: { type: String },
    assignTo: { type: String },
    document:  {type: String},
    commentBox: {type: String},
    isDeleted: { type: Boolean, default: false },
    status: [{
        _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
        newStatus: {type: String},
        commentBox: {type: String},
        duration: {type: String},
        document:  {type: String},
        delay: {type: String},
        tagPerson: {type: String},
        subject: {type: String},
        createdBy: { type: String },
        createdOn: { type: Date, default: Date.now },  // Automatically set to current date/time
        modifiedOn: { type: Date, default: Date.now }
    }],
    programTitle: {type: String},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Applicant = mongoose.model("Applicant", applicantSchema)