import * as mongoose from 'mongoose'


export interface CommissionDocument extends mongoose.Document {
    country?: string;
    universityName?: string;
    universityId?: any[];
    paymentMethod?: string;
    amount?: number;
    percentage?: number;
    commissionPaidOn?: string;
    eligibility?: string;
    tax?: string;
    paymentType?: string;
    currency?: string;
    flag?: string;
    clientName?: string;
    years?: any;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const commissionSchema = new mongoose.Schema({
    country: { type: String },
    universityName: { type: String },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
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
        year: {type: String},
        courseTypes: [{
            courseType: {type:String},
            inTake: {type: String},
            value: {type: Number}
        }]
    }],

    // years: [{
    //     year: { type: String },
    //     courseTypes: [{
    //         courseType: { type: String },
    //         summer:{type:String},
    //         winter:{type:String},
    //         fall:{type:String},
           
    //     }]
    // }],

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Commission = mongoose.model("Commission", commissionSchema)