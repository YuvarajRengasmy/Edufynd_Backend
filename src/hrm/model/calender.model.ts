import * as mongoose from 'mongoose'

export interface CalenderDocument extends mongoose.Document{
    _id?: any;
    title?: string;
    date?: Date;
    isLeave?: boolean;
    
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const calenderSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    title: {type: String},
    date: {type: Date},
    isLeave:{type: Boolean},
  
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Calender = mongoose.model("Calender", calenderSchema)