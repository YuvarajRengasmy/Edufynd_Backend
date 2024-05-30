import * as mongoose from 'mongoose'

export interface CountryDocument extends mongoose.Document{
    country?: string;
    state?: string;
    lga?: string;


    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const countrySchema = new mongoose.Schema({
    country: {type: String},
    state:{ type: String},
    lga:{ type: String},
 

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Country = mongoose.model("Country", countrySchema)