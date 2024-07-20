import * as mongoose from 'mongoose'


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
    applicationFee?: number;   //a
    discountedValue?: number;   //a
    finalValue?: number;
    currency?: string;
    flag?: string;
    popularCategories: any[];
    campuses?: any[];
    // courseFee?: number;
    // inTake?: any[];
    // duration?: string;
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
    programCode: {type: String},
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    appliedStudentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    universityName: { type: String }, // (List Universities added)
    universityLogo: { type: String },
    country: { type: String },
    programTitle: { type: String },
    applicationFee: { type: Number },
    discountedValue: { type: Number },
    finalValue: {type: Number},
    currency: { type: String },
    flag: { type: String },
   
    courseType: {type: String},  // (List) Add, Delete, View, Edit

    campuses: [{
        campus: { type: String },
        inTake: { type: String },
        duration: { type: String },
        courseFees: { type: String }
    }],
    popularCategories: [ String ],

    // courseFee: { type: Number },  // (To be added for each campus)
    // inTake: [String],
    // duration: { type: String }, // (Month & Year in numbers like 1 - 12),
    // campus: [String ],  //(Fetch campus details from ‘UNIVERSITY’ based on the university selected) / (Multiple Add)
    englishlanguageTest: { type: String },   // (ELT) requirement – Yes/No (Text Box)
    textBox: { type: String },
    universityInterview: { type: String },   // – Yes/No
    greGmatRequirement: { type: String },  //(Yes/No) If yes mention score
    score: { type: String },
    academicRequirement: { type: String },     //(Text Box)
    commission: { type: String },           // (Edit only for the program)
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date, default: new Date()},
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Program = mongoose.model("Program", programSchema)

