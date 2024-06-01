import * as mongoose from 'mongoose'


export interface InTakeDocument extends mongoose.Document{
    inTakeName?: string;
    startDate?: string;
    closeDate?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const inTakeSchema = new mongoose.Schema({
   
        inTakeName:{type:String},
        startDate:{type:String},
        closeDate:{type:String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const InTake = mongoose.model("InTake", inTakeSchema)