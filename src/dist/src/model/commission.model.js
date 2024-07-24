"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commission = void 0;
const mongoose = require("mongoose");
const commissionSchema = new mongoose.Schema({
    country: { type: String },
    universityName: { type: String },
    paymentMethod: { type: String },
    amount: { type: Number },
    percentage: { type: Number },
    commissionPaidOn: { type: String },
    eligibility: { type: String },
    tax: { type: String },
    paymentType: { type: String },
    currency: { type: String },
    flag: { type: String },
    clientName: { type: String },
    years: [{
            year: { type: String },
            courseTypes: [{
                    courseType: { type: String },
                    inTake: { type: String },
                    value: { type: Number }
                }]
        }],
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Commission = mongoose.model("Commission", commissionSchema);
//# sourceMappingURL=commission.model.js.map