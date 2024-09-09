import * as mongoose from 'mongoose'

export interface CampaignDocument extends mongoose.Document {
    platformName?: Date;
    campaignName?: string;
    budgetRequested?: string;
    budgetAlloted?: string;
    budgetSpent?: string;
    time?: string;
    leadsGenerated?: string;
    leadsConverted?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const campaignSchema = new mongoose.Schema({

    platformName:{type: String},
    campaignName: {type: String},
    budgetRequested: {type: String},
    budgetAlloted:{type: String},
    budgetSpent: {type: String},
    time: {type: String},
    leadsGenerated: {type: String},
    leadsConverted: {type: String},

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Campaign = mongoose.model("Campaign", campaignSchema)