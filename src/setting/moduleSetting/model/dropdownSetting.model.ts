import * as mongoose from 'mongoose'


export interface DropDownListDocument extends mongoose.Document {
    _id?: any;
    courseType?: string;        // Program Module
    popularCategories?: string;
    country?: string;
    offerTAT?: string;
    paymentMethod?: string;
    tax?: string;
    commissionPaidOn?: string;
    institutionType?: string;
    typeOfClient?: string;         // Client Module

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const dropDownListSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    courseType: { type: String },   // program module
    popularCategories: { type: String },
    country: { type: String },
    offerTAT: { type: String },
    institutionType: { type: String },
    paymentMethod: { type: String, },
    tax: { type: String },
    commissionPaidOn: { type: String },
    typeOfClient: {type: String},    // Client Module

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const DropDownList = mongoose.model("AllModule", dropDownListSchema)