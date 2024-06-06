import * as mongoose from 'mongoose'


export interface ProgramListDocument extends mongoose.Document {
  
    country?: string;
    courseType?: string;
    programTitle?: string;
    currency?: string;
    flag?: string;
  
    campus?: string;
    courseFee?: string;

 
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const programListSchema = new mongoose.Schema({
    courseType: [String],  // (List) Add, Delete, View, Edit
    currency: { type: String },
    flag: {type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const ProgramList = mongoose.model("ProgramList", programListSchema)

