import * as mongoose from 'mongoose'

export interface DailyTaskDocument extends mongoose.Document {
    seoType?: string;
    link1?: string;
    platformType?: string;
    link2?: string;
    posterName?: string;
    content?: string;
   
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const dailyTaskSchema = new mongoose.Schema({

    seoType: {type: String},
    link1: {type: String},
    platformType: {type: String},
    link2: {type: String},
    posterName: {type: String},
    content: {type: String},

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const DailyTask = mongoose.model("DailyTask", dailyTaskSchema)