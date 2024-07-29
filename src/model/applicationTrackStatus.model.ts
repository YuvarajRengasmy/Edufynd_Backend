import * as mongoose from 'mongoose'


export interface ApplicationTrackDocument extends mongoose.Document {

    isDeleted?: boolean;
    status?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const applicationTrackStatusSchema = new mongoose.Schema({
    status: { type: String },
    submitted: { type: String },
    processed: { type: String },
    rejected: { type: String },
    offered: { type: String },
    feesPaid: { type: String },
    enrolled: { type: String },

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const ApplicationTrack = mongoose.model("ApplicantTrack", applicationTrackStatusSchema)