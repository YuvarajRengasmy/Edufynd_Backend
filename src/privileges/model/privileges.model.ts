import * as mongoose from 'mongoose';


export interface PrivilegesDocument extends mongoose.Document {
    userId?: string;
    typeOfUser?: string;
    userName?: string;
    email: string;
    role: string;
    privileges?: any;

   
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const privilegeSchema = new mongoose.Schema({
    userId : {type: String},
    typeOfUser: {type : String},
    userName: {type : String},
    email:{type : String},
    role: {type : String},

    privileges: [{
        modelName: {type: String},
        permissions: {
            add: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            view: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }, // Not applicable for Admin, only for Super Admin
            approve: { type: Boolean, default: false }, // For modules that need approval
        },
    }]

});



export const Privilege = mongoose.model("Privilege", privilegeSchema)
