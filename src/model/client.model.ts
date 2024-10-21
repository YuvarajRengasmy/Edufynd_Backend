import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'


export interface ClientDocument extends mongoose.Document {
    _id?: any;
    typeOfClient?: string;  
    businessName?: string;
    website?: string;
    businessMailID?: string;
    dial1?: string;
    businessContactNo?: number;  
    name?: string;
    dial2?: string;
    contactNo?: number;
    country?: string;
    lga?: string;
    state?: string;
    emailID?: string;
    clientID?: string;
    isActive?: string;
    clientStatus?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    dial3?: string;      
    whatsAppNumber?: string;
    staffStatus?: string;     
    isDeleted?: boolean;
    privileges?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const clientSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    clientID: { type: String },
    typeOfClient: { type: String }, 
    businessName: { type: String },
    clientStatus: { type: String },
    businessMailID: { type: String },
    dial1: {type: String},
    businessContactNo: { type: Number },
    website: { type: String },
    addressLine1: { type: String }, 
    addressLine2: { type: String },
    addressLine3: { type: String },   
    isActive: {type: String,default: "InActive"},
    name: { type: String },
    country: { type: String },
    state: { type: String },
    lga:{ type: String },
    dial2: {type: String},
    contactNo: { type: Number },
    emailID: { type: String },
    dial3: {type: String},
    whatsAppNumber: { type: String },
    staffStatus: { type: String },   
    isDeleted: { type: Boolean, default: false },
    privileges: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

LoggingMiddleware(clientSchema)
export const Client = mongoose.model("Client", clientSchema)