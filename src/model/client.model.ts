import * as mongoose from 'mongoose'


export interface ClientDocument extends mongoose.Document {
    _id?: any;
    typeOfClient?: string;  
    businessName?: string;
    website?: string;
    businessMailID?: string;
    businessContactNo?: number;  
    name?: string;
    contactNo?: number;
    country?: string;
    lga?: string;
    state?: string;
    emailID?: string;
    clientID?: string;
   
    clientStatus?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;      
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
    clientID: { type: String},
    typeOfClient: { type: String }, 
    businessName: { type: String },
    clientStatus: { type: String },
    businessMailID: { type: String },
    businessContactNo: { type: Number },
    website: { type: String },
    addressLine1: { type: String }, 
    addressLine2: { type: String },
    addressLine3: { type: String },   
    name: { type: String },
    country: { type: String },
    state: { type: String },
    lga:{ type: String },
    contactNo: { type: Number },
    emailID: { type: String },
    whatsAppNumber: { type: String },
    staffStatus: { type: String },   
    isDeleted: { type: Boolean, default: false },
    privileges: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})


export const Client = mongoose.model("Client", clientSchema)