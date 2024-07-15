import * as mongoose from 'mongoose'

export interface MarketingDocument extends mongoose.Document {
    socialMedia?: string;
    noOfFollowers?: string;
    noOfCampaigns?: string;
    noOfLeads?: string;
    platformName?: Date;
    campaignName?: string;
    budgetRequested?: string;
    budgetAlloted?: string;
    budgetSpent?: string;
    leadsGenerated?: string;
    leadsConverted?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const marketingSchema = new mongoose.Schema({

    socialMedia: {type: String},
    noOfFollowers: {type: String},
    noOfCampaigns: {type: String},
    noOfLeads: {type: String},
    platformName:{type: String},
    campaignName: {type: String},
    budgetRequested: {type: String},
    budgetAlloted:{type: String},
    budgetSpent: {type: String},
    leadsGenerated: {type: String},
    leadsConverted: {type: String},
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Marketing = mongoose.model("Marketing", marketingSchema)