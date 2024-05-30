import * as mongoose from 'mongoose'

export interface CountryDocument extends mongoose.Document{
    countryName?: string;
    state?: string;
    city?: string;


    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const countrySchema = new mongoose.Schema({
    countryName: {type: String},
    state:{ type: String},
    city:{ type: String},
 

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Country = mongoose.model("Country", countrySchema)