"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marketing = void 0;
const mongoose = require("mongoose");
const marketingSchema = new mongoose.Schema({
    socialMedia: { type: String },
    noOfFollowers: { type: String },
    noOfCampaigns: { type: String },
    noOfLeads: { type: String },
    platformName: { type: String },
    campaignName: { type: String },
    budgetRequested: { type: String },
    budgetAlloted: { type: String },
    budgetSpent: { type: String },
    leadsGenerated: { type: String },
    leadsConverted: { type: String },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
});
exports.Marketing = mongoose.model("Marketing", marketingSchema);
//# sourceMappingURL=marketing.model.js.map