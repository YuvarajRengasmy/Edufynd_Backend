import * as mongoose from 'mongoose'


export interface QualificationDocument extends mongoose.Document {
    highestQualification?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const qualificationSchema = new mongoose.Schema({
    highestQualification: { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Qualification = mongoose.model("Qualification", qualificationSchema)