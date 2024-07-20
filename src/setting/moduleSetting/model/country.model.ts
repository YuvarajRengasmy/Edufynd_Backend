import * as mongoose from 'mongoose'



export interface CountryDocument extends mongoose.Document {
    name?: string;
    code?: string;
    state?: any[];
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const countrySchema = new mongoose.Schema({

    name: { type: String },
    code: {type: String},
    state: [{
        name: {type: String},     // State Name
        cities: [String]          // City Name
    }],
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


// export const Country = mongoose.model("CountryName", countrySchema)

export const CountryList = mongoose.model("CountryList", countrySchema)