import * as mongoose from 'mongoose'

export interface SocialMediaDocument extends mongoose.Document {
    socialMedia?: string;
    noOfFollowers?: string;
    noOfCampaigns?: string;
    noOfLeads?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const socialMediaSchema = new mongoose.Schema({

    socialMedia: {type: String},
    noOfFollowers: {type: String},
    noOfCampaigns: {type: String},
    noOfLeads: {type: String},
   
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema)