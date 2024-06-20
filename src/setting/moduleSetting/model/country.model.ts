import * as mongoose from 'mongoose'


export interface CountryDocument extends mongoose.Document {
    country?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const countrySchema = new mongoose.Schema({

    country: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Country = mongoose.model("CountryName", countrySchema)