import * as mongoose from 'mongoose'


export interface LoanEnquiryDocument extends mongoose.Document {
    studentName?: string;
    whatsAppNumber?: string;
    primaryNumber?: string;
    email?: string;
    doYouHaveAValidOfferFromAnyUniversity?: string;
    uploadOfferletter?: string;
    loanAmountRequired?: string;
    desiredCountry?: string;
    whatIsYourMonthlyIncome?: string;
    passportNumber?: string;
    uploadPassport?: string;
    didYouApplyForLoanElsewhere?: string;
    chooseTheBankYouPreviouslyApplied?: string;
    statusOfPreviousApplication?: string;
    // Who is your co-applicant?
    name?: string;
    age?: string;
    employmentStatus?: string
    incomeDetails?: string;
    willyouSubmitYourCollateral?: String;


}


const loanEnquirySchema = new mongoose.Schema({
    studentName: {type: String},
    whatsAppNumber: {type: String},
    primaryNumber: {type: String},
    email: {type: String},
    doYouHaveAValidOfferFromAnyUniversity: {type: String},
    uploadOfferletter: {type: String},
    loanAmountRequired: {type: String},
    desiredCountry: {type: String},
    whatIsYourMonthlyIncome: {type: String},
    passportNumber: {type:String},
    uploadPassport: {type:  String},
    didYouApplyForLoanElsewhere: {type: String},
    chooseTheBankYouPreviouslyApplied: {type: String},
    statusOfPreviousApplication: {type: String},
    // Who is your co-applicant?
    name: {type: String},
    age: {type: String},
    employmentStatus: {type: String},
    incomeDetails: {type: String},
    willyouSubmitYourCollateral: {type: String}

})

export const LoanEnquiry = mongoose.model('LoanEnquiry', loanEnquirySchema)