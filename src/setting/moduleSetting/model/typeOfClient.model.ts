import * as mongoose from 'mongoose'


export interface TypeOfClientDocument extends mongoose.Document {
    typeOfClient?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const typeOfClientSchema = new mongoose.Schema({
    typeOfClient: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const TypeOfClient = mongoose.model("TypeOfClient", typeOfClientSchema)