import * as mongoose from 'mongoose'
import { clientError } from 'src/helper/ErrorMessage';

export interface UniversityDocument extends mongoose.Document {
    _id?: any;
    superAdminId?: any;
    appliedStudentId?: any;
    businessName?: string;
    universityName?: string; // University Name
    email?: string;
    banner?: string;
    universityLogo?: string; // University Logo (Optional)
    countryName?: string; // Country
    country?: string;
    flag?: string;
    campus?: any[];
    ranking?: string; // Ranking (Optional)
    averageFees?: number; // Average Fees
    popularCategories?: any[]; // Popular Categories (Multiple)
    admissionRequirement?: string; // Admission Requirement (Text box)
    offerTAT?: string; // Offer TAT
    inTake?: any[];
    paymentMethod?: string;
    amount?: string;
    percentage?: string;
    eligibilityForCommission?: string;
    currency?: string;
    paymentTAT?: string;
    tax?: string;
    commissionPaidOn?: string;
    founded?: string;
    institutionType?: string;
    applicationFees?: string;
    costOfLiving?: string;
    grossTuition?: string;
}


const universitySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    universityName: { type: String },
    email: { type: String },
    country: {type: String},
    countryName: { type: String },
    flag: {type: String},
    campus: [String ],
    ranking: { type: String },
    averageFees: { type: String },
    popularCategories: [ String ],
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
    founded: { type: String },
    institutionType: { type: String },
    applicationFees: { type: String },
    costOfLiving: { type: String },
    grossTuition: { type: String },
    businessName: { type: String },      // Client Name
    banner: {type: String},
    universityLogo: { type: String },
})

export const University = mongoose.model("University", universitySchema)