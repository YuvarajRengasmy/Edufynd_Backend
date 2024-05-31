import * as mongoose from 'mongoose'


export interface UniversityListDocument extends mongoose.Document {
    courseType?: string;
    popularCategories?: string;
    country?: string;
    offerTAT?: string;
    paymentMethod?: string;
    tax?: string;
    commissionPaidOn?: string;
    institutionType?: string;

    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const universityListSchema = new mongoose.Schema({
    courseType: { type: String },
    popularCategories: { type: String },
    country: { type: String },
    offerTAT: { type: String },
    institutionType: { type: String },
    paymentMethod: { type: String, },
    tax: { type: String },
    commissionPaidOn: { type: String },

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const UniversityList = mongoose.model("UniversityList", universityListSchema)