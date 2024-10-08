import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'


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
    isActive?: string;
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
            inTake:[{
                inTake: {type: String}, 
                 value: {type: Number}
                }] ,
          
        }],
    }],
    isActive: {type: String,default: "InActive"},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})


LoggingMiddleware(commissionSchema)
export const Commission = mongoose.model("Commission", commissionSchema)