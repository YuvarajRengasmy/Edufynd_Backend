import * as mongoose from 'mongoose'


export interface CommissionDocument extends mongoose.Document{
    country?: string;
    universityName?: string;
    paymentMethod?: string;
    commissionPaidOn?: string;
    eligibility?: string;


}