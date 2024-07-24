"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanEnquiry = void 0;
const mongoose = require("mongoose");
const loanEnquirySchema = new mongoose.Schema({
    loanID: { type: String },
    studentId: { type: String },
    country: { type: String },
    message: { type: String },
    studentName: { type: String },
    whatsAppNumber: { type: String },
    primaryNumber: { type: String },
    email: { type: String },
    doYouHaveAValidOfferFromAnyUniversity: { type: String },
    uploadOfferletter: { type: String },
    universityName: { type: String },
    loanAmountRequired: { type: String },
    desiredCountry: { type: String },
    whatIsYourMonthlyIncome: { type: String },
    passportNumber: { type: String },
    uploadPassport: { type: String },
    didYouApplyForLoanElsewhere: { type: String },
    chooseTheBankYouPreviouslyApplied: { type: String },
    statusOfPreviousApplication: { type: String },
    // Who is your co-applicant?
    coApplicantName: { type: String },
    age: { type: String },
    employmentStatus: { type: String },
    incomeDetails: { type: String },
    willyouSubmitYourCollateral: { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.LoanEnquiry = mongoose.model('LoanEnquiry', loanEnquirySchema);
//# sourceMappingURL=loanEnquiry.model.js.map