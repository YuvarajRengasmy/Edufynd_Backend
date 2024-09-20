import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../../../helper/commonResponseHandler'
export interface EmailDocument extends mongoose.Document{
    from?: string;
    to?: string;
    subject?: string;
    content?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const emailSchema = new mongoose.Schema({
    from: {type: String},
    to:{ type: String},
    subject:{ type: String},
    content:{ type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})


LoggingMiddleware(emailSchema)
export const Email = mongoose.model("Email", emailSchema)