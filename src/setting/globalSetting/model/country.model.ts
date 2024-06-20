import * as mongoose from 'mongoose'

export interface CountryDocument extends mongoose.Document{
    country?: any[];
  

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const countrySchema = new mongoose.Schema({
    country: [String],


    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Country = mongoose.model("Country", countrySchema)