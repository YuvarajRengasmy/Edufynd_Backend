import * as mongoose from 'mongoose'


export interface SuperAdminDocument extends mongoose.Document{
    name?: string;
    email?: string;
    mobileNumber?: string;
    password?: string;
    confirmPassword?: string;
}


const superAdminSchema = new mongoose.Schema({
    name: {type: String},
    email: { type: String},
    mobileNumber: {type: String},
    password: {type: String},
    confirmPassword: {type: String}
})

export const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema)
export default SuperAdmin