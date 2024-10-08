import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'

export interface UniversityDocument extends mongoose.Document {
    _id?: any;
    universityCode?: string;
    superAdminId?: any;
    appliedStudentId?: any;
    businessName?: string;
    universityName?: string;
    about?: string;
    courseType?: any[];
    email?: string;
    banner?: string;
    universityLogo?: string;
    countryName?: string;
    country?: string;
    flag?: string;
    campuses?: any[];
    ranking?: string;
    averageFees?: number;
    popularCategories?: any[];
    admissionRequirement?: string;
    offerTAT?: string;
    paymentMethod?: string;
    amount?: string;
    percentage?: string;
    eligibilityForCommission?: string;
    currency?: string;
    paymentTAT?: string;
    tax?: string;
    commissionPaidOn?: string;
    courseFeesPercentage?: number;
    paidFeesPercentage?: number;
    founded?: string;
    institutionType?: string;
    website?: string;
    inTake?: any[];
    typeOfClient?: string;
    couponCode?: string;
    universityStatus?: string;
    commissionType?: string;
    commissionValue?: string;
    isDeleted?: boolean;
    isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

}


const universitySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    universityCode: { type: String },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    universityName: { type: String },
    about: { type: String },
    courseType: [String],
    email: { type: String },
    countryName: { type: String },
    flag: { type: String },
    country: { type: String },
    campuses: [{
        state: { type: String },
        lga: { type: String },
        primary: { type: String },
    }],

    ranking: { type: String },
    averageFees: { type: String },
    popularCategories: [String],
    admissionRequirement: { type: String },
    offerTAT: { type: String },
    paymentMethod: { type: String, },
    amount: { type: String },
    percentage: { type: String },
    eligibilityForCommission: { type: String },
    currency: { type: String },
    paymentTAT: { type: String },
    tax: { type: String },
    commissionPaidOn: { type: String },
    courseFeesPercentage: { type: Number },
    paidFeesPercentage: { type: Number },
    founded: { type: String },
    institutionType: { type: String },
    businessName: { type: String },
    banner: { type: String },
    universityLogo: { type: String },
    website: { type: String },
    inTake: [String],
    typeOfClient: {type: String},
    couponCode: {type: String},
    universityStatus:{type: String},
    commissionType: {type: String},
    commissionValue: {type: String},
    isDeleted: { type: Boolean, default: false },
    isActive: {type: String,default: "InActive"},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

LoggingMiddleware(universitySchema)
export const University = mongoose.model("University", universitySchema)