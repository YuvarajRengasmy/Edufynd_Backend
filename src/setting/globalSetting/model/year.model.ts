import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../../../helper/commonResponseHandler'

export interface YearDocument extends mongoose.Document{
  
    year?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const yearSchema = new mongoose.Schema({
    year: {type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

LoggingMiddleware(yearSchema)
export const Year = mongoose.model("Year", yearSchema)