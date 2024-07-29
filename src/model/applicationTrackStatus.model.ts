import * as mongoose from 'mongoose'


export interface ApplicantTrackDocument extends mongoose.Document {
   
    isDeleted?: boolean;
    status?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const applicantTrackStatusSchema = new mongoose.Schema({


   

    isDeleted: { type: Boolean, default: false },
    status: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Applicant = mongoose.model("Applicant", applicantTrackStatusSchema)