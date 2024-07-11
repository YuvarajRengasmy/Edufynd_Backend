import * as mongoose from 'mongoose'


export interface CommissionDocument extends mongoose.Document{
    country?: string;
    universityName?: string;
    paymentMethod?: string;
    commissionPaidOn?: string;
    eligibility?: string;
    tax?: string;
    paymentType?: string;
    year?: string;
    courseType?: string;
    inTake?: any;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const commissionSchema = new mongoose.Schema({
    country: {type: String},
    universityName: {type:String},
    paymentMethod: {type: String},
    commissionPaidOn: {type: String},
    eligibility: {type: String},
    tax: {type: String},
    paymentType: {type: String},
    year: {type: String},
    courseType: {type: String},
    inTake: [{
        inTake1: {type: String},
        value1: {type: Number},

        inTake2: {type: String},
        value2: {type: Number},

        inTake3:{type: String},
        value3: {type: Number}
    }],

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Commission = mongoose.model("Commission", commissionSchema)