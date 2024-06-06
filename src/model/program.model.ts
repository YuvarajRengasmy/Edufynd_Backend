import * as mongoose from 'mongoose'


export interface ProgramDocument extends mongoose.Document {
    superAdminId?: any;
    appliedStudentId?: any;
    universityId?: any;
    universityName?: string;
    universityLogo?: string;
    country?: string;
    courseType?: any[];
    programTitle?: string;
    applicationFee?: string;
    currency?: string;
    flag?: string;
    discountedValue?: string;
    campus?: any[];
    courseFee?: string;
    inTake?: any[];
    duration?: string;
    englishlanguageTest?: string;
    textBox?: string;
    universityInterview?: string;
    greGmatRequirement?: string;
    score?: string;
    academicRequirement?: string;
    commission?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
    

}

const programSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    appliedStudentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    universityName: { type: String }, // (List Universities added)
    universityLogo: {type: String},
    country: {type: String},
    courseType: [String],  // (List) Add, Delete, View, Edit
    programTitle: {type:String},
    applicationFee: { type: String },
    currency: { type: String },
    flag: {type: String},
    discountedValue: { type: String },
    campus: [String ],  //(Fetch campus details from ‘UNIVERSITY’ based on the university selected) / (Multiple Add) 
    courseFee: { type: String },  // (To be added for each campus)
    inTake: [String],
    duration: { type: String }, // (Month & Year in numbers like 1 - 12),
    englishlanguageTest: { type: String },   // (ELT) requirement – Yes/No (Text Box)
    textBox: { type: String },
    universityInterview : { type: String },   // – Yes/No
    greGmatRequirement : { type: String },  //(Yes/No) If yes mention score
    score: { type: String },
    academicRequirement : { type: String },     //(Text Box)
    commission: { type: String },           // (Edit only for the program)
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Program = mongoose.model("Program", programSchema)

