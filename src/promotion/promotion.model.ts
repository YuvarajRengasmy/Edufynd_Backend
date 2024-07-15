import * as mongoose from 'mongoose'



export interface PromotionDocument extends mongoose.Document {
    typeOfUser?: string;
    userName?: string;
    subject?: string;
    content?: string;
    uploadImage?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const promotionSchema = new mongoose.Schema({

    typeOfUser: {type: String},
    userName: {type: String},
    subject: {type: String},
    content: {type: String},
    uploadImage: {type: String},

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Promotion = mongoose.model("Promotion", promotionSchema)