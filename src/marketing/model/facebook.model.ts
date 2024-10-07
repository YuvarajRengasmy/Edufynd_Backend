import * as mongoose from 'mongoose'

export interface FaceBookDocument extends mongoose.Document {
    message?: string;
    image?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const facebookSchema = new mongoose.Schema({
    message: { type: String },
    image: { type: String },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Facebook = mongoose.model("Facebook", facebookSchema)