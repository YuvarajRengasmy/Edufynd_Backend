import * as mongoose from 'mongoose'


export interface InTakeDocument extends mongoose.Document{
    intakeName?: string;
    startDate?: string;
    endDate?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const inTakeSchema = new mongoose.Schema({
   
        intakeName:{type:String},
        startDate:{type:String},
        endDate:{type:String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const InTake = mongoose.model("InTake", inTakeSchema)