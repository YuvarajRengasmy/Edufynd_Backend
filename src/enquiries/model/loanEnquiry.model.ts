import * as mongoose from 'mongoose'


export interface LoanEnquiryDocument extends mongoose.Document {
    loanID?: string;
    studentId?: string,
    country?: string;
    message?: string;
    studentName?: string;
    dial1?: string;
    whatsAppNumber?: string;
    dial2?: string;
    primaryNumber?: string;
    email?: string;
    doYouHaveAValidOfferFromAnyUniversity?: string;
    uploadOfferletter?: string;
    universityName?: string;
    loanAmountRequired?: string;
    desiredCountry?: string;
    whatIsYourMonthlyIncome?: string;
    passportNumber?: string;
    expiryDate?: string;
    uploadPassport?: string;
    didYouApplyForLoanElsewhere?: string;
    chooseTheBankYouPreviouslyApplied?: string;
    statusOfPreviousApplication?: string;
    coApplicantName?: string;
    age?: string;
    employmentStatus?: string;
    incomeDetails?: string;
    willyouSubmitYourCollateral?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;


}


const loanEnquirySchema = new mongoose.Schema({
    loanID: {type: String},
    studentId: {type: String},
    country: {type: String},
    message: {type: String},
    studentName: {type: String},
    dial1:{type: String},
    whatsAppNumber: {type: String},
    dial2:{type: String},
    primaryNumber: {type: String},
    email: {type: String},
    doYouHaveAValidOfferFromAnyUniversity: {type: String},
    uploadOfferletter: {type: String},
    universityName: {type: String},
    loanAmountRequired: {type: String},
    desiredCountry: {type: String},
    whatIsYourMonthlyIncome: {type: String},
    passportNumber: {type:String},
    expiryDate:{  type: String },
    uploadPassport: {type:  String},
    didYouApplyForLoanElsewhere: {type: String},
    chooseTheBankYouPreviouslyApplied: {type: String},
    statusOfPreviousApplication: {type: String},
    coApplicantName: {type: String},
    age: {type: String},
    employmentStatus: {type: String},
    incomeDetails: {type: String},
    willyouSubmitYourCollateral: {type: String},

    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const LoanEnquiry = mongoose.model('LoanEnquiry', loanEnquirySchema)