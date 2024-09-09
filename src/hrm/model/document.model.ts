import * as mongoose from 'mongoose'

export interface UploadDocument extends mongoose.Document {
    _id?: any;
    uploadDocument?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const uploadSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    uploadDocument: { type: String },

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Upload = mongoose.model("Upload", uploadSchema)