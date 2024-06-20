import * as mongoose from 'mongoose'

export interface CurrencyDocument extends mongoose.Document{
    country?: string;
    currency?: string;
    flag?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const currencySchema = new mongoose.Schema({
    country: {type: String},
    currency: {type: String},
    flag:{ type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Currency = mongoose.model("Currency", currencySchema)