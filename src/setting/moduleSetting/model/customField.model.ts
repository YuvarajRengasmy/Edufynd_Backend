import * as mongoose from 'mongoose'


export interface CustomFieldDocument extends mongoose.Document{
    customFieldFor?: string;
    fieldLabel?: string;
    defaultValue?: string;
    helpText?: string;
    fieldType?: string;
    thisFieldIsRequired?: string;
    showOnTable?: string;
    showOnDetails?: string;
    visibleForAdminOnly?: string;
    visibleForClient?: string;
    active?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const customFieldSchema = new mongoose.Schema({
    customFieldFor: {type: String},
    fieldLabel: { type: String},
    defaultValue: { type: String},
    helpText: { type: String},
    fieldType: { type: String},
    thisFieldIsRequired: {type: String},
    showOnTable: { type: String},
    visibleForAdminOnly: {type: String},
    visibleForClient: {type: String},
    active:{ type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const CustomField = mongoose.model('CustomField', customFieldSchema)