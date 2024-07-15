import * as mongoose from 'mongoose'


export interface ClientDocument extends mongoose.Document {
    _id?: any;
    typeOfClient?: string;    // - Institution, Financial Institution, Other Service Provider
    businessName?: string;
    website?: string;
    businessMailID?: string;
    businessContactNo?: number;  //a
    name?: string;
    contactNo?: number;
    emailID?: string;
    clientID?: string;
    clientStatus?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;      // Street Address, City, State, Postal Code, Country
    whatsAppNumber?: number;   //a
    state?: any[];
    lga?: any[];
    staffStatus?: string;     // (Active/Inactive)
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
    typeOfClient: { type: String },  // - Institution, Financial Institution, Other Service Provider
    businessName: { type: String },
    clientStatus: { type: String },
    businessMailID: { type: String },
    businessContactNo: { type: Number },
    website: { type: String },
    addressLine1: { type: String }, // No Street Address, 
    addressLine2: { type: String },// , City, State, 
    addressLine3: { type: String },   //  Postal Code, Country
    name: { type: String },
    contactNo: { type: Number },
    emailID: { type: String },
    whatsAppNumber: { type: Number },
    state: [String],
    lga: [String],
    staffStatus: { type: String },    // (Active/Inactive)
    isDeleted: { type: Boolean, default: false },
    privileges: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})


export const Client = mongoose.model("Client", clientSchema)