import * as mongoose from 'mongoose'


export interface ClientDocument extends mongoose.Document {
    _id?: any;
    clientID?: string;
    typeOfClient?: string;    // - Institution, Financial Institution, Other Service Provider
    businessName?: string;
    businessMailID?: string;
    businessContactNo?: string;
    website?: string;
    addressLine1?: string;
    name?: string;
    contactNo?: string;
    emailID?: string;
    addressLine2?: string;
    addressLine3?: string;      // Street Address, City, State, Postal Code, Country
    gstn?: string;
    status?: string;     // (Active/Inactive)
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
    typeOfClient: { type: String },  // - Institution, Financial Institution, Other Service Provider
    businessName: { type: String },
    businessMailID: { type: String },
    businessContactNo: { type: String },
    website: { type: String },
    addressLine1: { type: String }, // No Street Address, 
    name: { type: String },
    contactNo: { type: String },
    emailID: { type: String },
    addressLine2: { type: String },// , City, State, 
    addressLine3: { type: String } ,   //  Postal Code, Country
    gstn: { type: String },
    status: { type: String },    // (Active/Inactive)
    isDeleted: { type: Boolean, default: false },
     privileges: {type: String},
     createdOn: { type: Date },
     createdBy: { type: String },
     modifiedOn: { type: Date },
     modifiedBy: { type: String },

})


export const Client = mongoose.model("Client", clientSchema)