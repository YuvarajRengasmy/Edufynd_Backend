import * as mongoose from 'mongoose'


export interface StaffDocument extends mongoose.Document {
    _id?: any;
    employeeID?: string;
    empName?: string;
    dob?: String;    
    designation?: string;
    doj?: String; 
    reportingManager?: string;
    shiftTiming?: string;
    probationDuration?: string;
    email?: string;
    mobileNumber?: number;  
    emergencyContactNo?: number;   
    address?: string;
    idCard?: boolean;    
    privileges?: string;
    description?: string;
  // Extra Fields  
    photo?: string;
    jobDescription?: string;
    areTheyEligibleForCasualLeave?: boolean; 
    salary?: string   
    manageApplications?: string;   
    active?:string;  
    teamLead?: string;   
    password?: string;
    confirmPassword?: string;
    isDeleted?: boolean;
    bankName?: string;
    bankAccountNo?: string;
    bankIFSC?: string;
    bankBranch?: string;
    pfAccountNo?: string;
    
// Newly added fields
    team?: string;
    staffList?: any[];
    personalMail?: string;
    address2?: string;
    pin?: number;
    country?: string;
    state?: string;
    city?: string;
    activeStatus?: string;
    companyAssests?: string;
    mobileName?: string;
    brandName?: string;
    imei?: string;
    phoneNumber?: number;
    laptopName?: string;
    brand?: string;
    modelName?: string;
    ipAddress?: string;
    userName?: string;
    loginPassword?: string;   
    notificationId?: any;
    clockIn?: Date;
    clockOut?: Date;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const staffSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    employeeID: {type: String},
    photo: {type: String},
    empName: {type: String},
    designation: {type: String},
    jobDescription: {type: String},
    reportingManager: {type: String},
    description: {type: String},
    shiftTiming: {type: String},                       
    areTheyEligibleForCasualLeave: {type: String},          
    doj: {type: String},                   
    dob: {type: String},                  
    address: {type: String},
    email: {type: String},
    mobileNumber: {type: Number},
    emergencyContactNo: {type: Number},
    probationDuration: {type: String},
    salary: {type: String},                
    idCard: {type: String},                   
    manageApplications: {type: String},          
    active: {type: String},              
    teamLead: {type: String},   
    password: { type: String },
    confirmPassword: { type: String },  
    isDeleted: { type: Boolean, default: false },
    privileges: {type: String},  
    // Newly added fields
    team: {type: String},
    staffList: [String],
    personalMail: {type: String},
    address2:  { type: String },
    pin:  { type: Number },
    country:  { type: String },
    state: { type: String },
    city:  { type: String },
    activeStatus: { type: String },
    companyAssests:  { type: String },
    mobileName:  { type: String },
    brandName:  { type: String },
    imei: { type: String },
    phoneNumber:  { type: Number },
    laptopName: { type: String },
    brand:  { type: String },
    modelName:  { type: String },
    ipAddress: { type: String },
    userName:  { type: String },
    loginPassword:  { type: String },
    clockIn: {type: Date},
    clockOut: {type: Date},
    bankName:{type: String},
    bankAccountNo:{type: String},
    bankIFSC:{type: String},
    bankBranch:{type: String},
    pfAccountNo:{type: String},
    notificationId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})
export const Staff = mongoose.model('Staff', staffSchema)