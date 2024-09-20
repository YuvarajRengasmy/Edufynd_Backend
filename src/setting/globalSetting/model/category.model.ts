import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../../../helper/commonResponseHandler'

export interface CategoryDocument extends mongoose.Document {
    categoryName?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const categorySchema = new mongoose.Schema({
    categoryName: { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

LoggingMiddleware(categorySchema)
export const Category = mongoose.model("Category", categorySchema)