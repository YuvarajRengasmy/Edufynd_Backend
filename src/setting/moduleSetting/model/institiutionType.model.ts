import * as mongoose from 'mongoose'


export interface InstitutionTypeDocument extends mongoose.Document {
    institutionType?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const institutionTypeSchema = new mongoose.Schema({

    institutionType: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const InstitutionType = mongoose.model("InstitutionType", institutionTypeSchema)