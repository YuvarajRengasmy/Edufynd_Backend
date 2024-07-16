import * as mongoose from 'mongoose'

export interface StudentEnquiryDocument extends mongoose.Document {
    _id?: any;
    studentCode?: string;
    studentId?: string,
    source?: string;
    message?: string;
    name?: string;
    dob?: string;
    passportNo?: string;
    email?: string;
    primaryNumber?: string;
    whatsAppNumber?: string;
    qualification?: string;
    yearPassed?: string;
    cgpa?: string;
    desiredCountry?: string;
    desiredCourse?: string;

    doYouNeedSupportForLoan?: string;
    assignedTo?: string;

    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;


    // New Added Field
    gender?: string;
    citizenShip?: string;
    expiryDate?: Date;
    desiredUniversity?: string;
    doYouHoldAnyOtherOffer?: string;
    country?: string;
    universityName?: string;
    programName?: string;
    refereeName?: string;
    refereeContactNo?: number;
    registerForIELTSClass?: string;


};

const studentEnquirySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    studentCode: { type: String },
    studentId: {type: String},
    message: {type: String},
    source: { type: String },
    name: { type: String },
    dob: { type: Date },
    passportNo: { type: String },
    qualification: { type: String },
    whatsAppNumber: { type: String },
    primaryNumber: { type: String },
    email: { type: String },
    cgpa: { type: String },
    yearPassed: { type: String },
    desiredCountry: { type: String },
    desiredCourse: { type: String },
    doYouNeedSupportForLoan: { type: String },
    assignedTo: { type: String },



    // New Added Field
    gender: { type: String },
    citizenShip: { type: String },
    expiryDate:{ type: Date },
    desiredUniversity: { type: String },
    doYouHoldAnyOtherOffer: { type: String },
    country: { type: String },
    universityName: { type: String },
    programName: { type: String },
    refereeName: { type: String },
    refereeContactNo: { type: Number },
    registerForIELTSClass: { type: String },

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


export const StudentEnquiry = mongoose.model("StudentEnquiry", studentEnquirySchema)