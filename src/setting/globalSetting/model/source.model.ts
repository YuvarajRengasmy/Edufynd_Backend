import * as mongoose from 'mongoose'

export interface SourceDocument extends mongoose.Document{
    _id?: any;
    sourceName?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const sourceSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    sourceName: {type: String},

    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Source = mongoose.model("Source", sourceSchema)