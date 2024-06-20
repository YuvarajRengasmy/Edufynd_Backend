import * as mongoose from 'mongoose'


export interface OfferTATDocument extends mongoose.Document {
    offerTAT?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const OfferTATSchema = new mongoose.Schema({
    offerTAT: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const OfferTAT = mongoose.model("OfferTAT", OfferTATSchema)