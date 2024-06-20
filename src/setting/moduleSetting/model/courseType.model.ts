import * as mongoose from 'mongoose'


export interface CourseTypeListDocument extends mongoose.Document {
    courseType?: string;        // Program Module
  

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const courseTypeListSchema = new mongoose.Schema({
    courseType: { type: String },   // program module
 

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const CourseTypeList = mongoose.model("CourseType", courseTypeListSchema)