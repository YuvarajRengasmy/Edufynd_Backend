import * as mongoose from 'mongoose'


export interface TypeOfClientDocument extends mongoose.Document {
    typeOfClient?: string;         // Client Module
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const typeOfClientSchema = new mongoose.Schema({
    typeOfClient: {type: String},    // Client Module
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const TypeOfClient = mongoose.model("TypeOfClient", typeOfClientSchema)