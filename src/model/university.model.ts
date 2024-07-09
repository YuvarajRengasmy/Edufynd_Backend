import * as mongoose from 'mongoose'


export interface UniversityDocument extends mongoose.Document {
    _id?: any;
    universityCode?: string;
    superAdminId?: any;
    clientId?: any;
    appliedStudentId?: any;
    businessName?: string;
    universityName?: string; // University Name
    about?: string;
    courseType?: any[];
    email?: string;
    banner?: string;
    universityLogo?:string; // University Logo (Optional)
    countryName?: string; // Country
    country?: string;
    flag?: string;
    state?: any[];
    lga?: any[];
    ranking?: string; // Ranking (Optional)
    averageFees?: number; // Average Fees
    popularCategories?: any[]; // Popular Categories (Multiple)
    admissionRequirement?: string; // Admission Requirement (Text box)
    offerTAT?: string; // Offer TAT
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
   
    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

    // applicationFees?: string;
    // costOfLiving?: string;
    // grossTuition?: string;
}


const universitySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    universityCode: {type: String},
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    clientId: { type: mongoose.Types.ObjectId, ref: 'Client', required: true },
    universityName: { type: String },
    about: {type: String},
    courseType: [String] ,
    email: { type: String },
    country: {type: String},
    countryName: { type: String },
    flag: {type: String},
    state: [String ],   
    lga: [String],
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
    businessName: { type: String },      // Client Name
    banner: {type: String},
    universityLogo: { type: String },

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

    // applicationFees: { type: String },
    // costOfLiving: { type: String },
    // grossTuition: { type: String },
})


// // Add a virtual property for createdOn in IST
// universitySchema.virtual('createdOnIST').get(function() {
//     if (this.createdOn) {
//         return moment(this.createdOn).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
//     }
//     return null;
// });

// // Ensure virtual fields are included in toJSON and toObject output
// universitySchema.set('toJSON', { virtuals: true });
// universitySchema.set('toObject', { virtuals: true });


export const University = mongoose.model("University", universitySchema)