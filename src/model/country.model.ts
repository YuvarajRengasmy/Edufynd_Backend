import * as mongoose from 'mongoose'


export interface CountryDocument extends mongoose.Document{
    country?: string;
}


const countrySchema = new mongoose.Schema({
  country: {type: String}
})

export const Country = mongoose.model("Country", countrySchema)