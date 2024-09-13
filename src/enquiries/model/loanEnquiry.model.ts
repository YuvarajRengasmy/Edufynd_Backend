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

    //Newly Added
    studentCode?: string;
    dial3?: string;
    agentPrimaryNo?: string;
    dial4?: string;
    agentWhatsAppNo?: string;
    agentMail?: string;
    plannedUniversity?: string;
    courseFee?: string;
    preferedLoanType?: string;
    previousLoanApplied?: string;
    whatIsYourLoanHistory?: string;
    coApplicantMail?: string;
    dial5?: string;
    coApplicantPrimaryNo?: string;
    dial6?: string;
    coApplicantWhatsAppNo?: string;
    relationship?: string;
    adminId?: any;
    staffId?: any;
    status?: any;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;


}


const loanEnquirySchema = new mongoose.Schema({
    adminId: { type: mongoose.Types.ObjectId, ref: 'Admin'},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    loanID: { type: String },
    studentId: { type: String },
    country: { type: String },
    message: { type: String },
    studentName: { type: String },
    dial1: { type: String },
    whatsAppNumber: { type: String },
    dial2: { type: String },
    primaryNumber: { type: String },
    email: { type: String },
    doYouHaveAValidOfferFromAnyUniversity: { type: String },
    uploadOfferletter: { type: String },
    universityName: { type: String },
    loanAmountRequired: { type: String },
    desiredCountry: { type: String },
    whatIsYourMonthlyIncome: { type: String },
    passportNumber: { type: String },
    expiryDate: { type: String },
    uploadPassport: { type: String },
    didYouApplyForLoanElsewhere: { type: String },
    chooseTheBankYouPreviouslyApplied: { type: String },
    statusOfPreviousApplication: { type: String },
    coApplicantName: { type: String },
    age: { type: String },
    employmentStatus: { type: String },
    incomeDetails: { type: String },
    willyouSubmitYourCollateral: { type: String },

    //Newly Added
    studentCode: { type: String },
    dial3: { type: String },
    agentPrimaryNo: { type: String },
    dial4: { type: String },
    agentWhatsAppNo: { type: String },
    agentMail: { type: String },
    plannedUniversity: { type: String },
    courseFee: { type: String },
    preferedLoanType: { type: String },
    previousLoanApplied: { type: String },
    whatIsYourLoanHistory: { type: String },
    coApplicantMail: { type: String },
    dial5: { type: String },
    coApplicantPrimaryNo: { type: String },
    dial6: { type: String },
    coApplicantWhatsAppNo: { type: String },
    relationship: { type: String },
    status: [{
        _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
        newStatus: {type: String},
        commentBox: {type: String},
        duration: {type: String},
        progress: {type: String},
        document:  {type: String},
        delay: {type: String},
        tagPerson: {type: String},
        subject: {type: String},
        reply: [{
            replyMessage: {type: String},
            createdBy: { type: String },
    
        }]
    }],
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const LoanEnquiry = mongoose.model('LoanEnquiry', loanEnquirySchema)