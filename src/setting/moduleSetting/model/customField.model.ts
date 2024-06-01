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
    active:{ type: String}

})

export const CustomField = mongoose.model('CustomField', customFieldSchema)