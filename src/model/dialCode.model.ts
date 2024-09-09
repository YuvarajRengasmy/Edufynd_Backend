import * as mongoose from 'mongoose'



export interface DialCodeDocument extends mongoose.Document {
    name?: string;
    code?: string;
    dialCode?: string;
    flag?: string;
}

const dialCodeSchema = new mongoose.Schema({
    name: { type: String },
    code: {type: String},
    dialCode: {type: String},
    flag: {type: String},
  
})

export const DialCode = mongoose.model("DialCode", dialCodeSchema)