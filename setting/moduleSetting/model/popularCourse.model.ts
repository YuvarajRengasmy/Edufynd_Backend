import * as mongoose from 'mongoose'


export interface PopularCategoryDocument extends mongoose.Document {
    popularCategories?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const PopularCategorySchema = new mongoose.Schema({
    popularCategories: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const PopularCategory = mongoose.model("PopularCategory", PopularCategorySchema)