import * as mongoose from 'mongoose'


export interface StaffDocument extends mongoose.Document {
    employeeID?: string;
    photo?: string;
    empName?: string;
    designation?: string;
    jobDescription?: string;
    reportingManager?: string;
    shiftTiming?: string; // (Attendance to be calculated based on this)
    areTheyEligibleForCasualLeave?: boolean; // – Yes/No (Yes – Casual to be considered | No – Casual leave restricted)
    doj?: String; // (Date of Joining)
    dob?: String;    // (Date of Birth)
    address?: string;
    email?: string;
    mobileNumber?: string;
    emergencyContactNo?: string;
    probationDuration?: string;
    salary?: string    // (Break Up with deduction – Manual)
    idCard?: boolean;    // – Yes / No (If ‘Yes’ card to be generated)
    manageApplications?: string;   // Yes/No
    //If Yes, List Country & University The user can only handle applications of these universities and country
    activeInactive?:string;   // – User
    teamLead?: string;     // – Select Employees and permission to be viewed.
    password?: string;
    confirmPassword?: string;
    isDeleted?: boolean;
  
    privileges?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const staffSchema = new mongoose.Schema({
    employeeID: {type: String},
    photo: {type: String},
    empName: {type: String},
    designation: {type: String},
    jobDescription: {type: String},
    reportingManager: {type: String},
    shiftTiming: {type: String},                        // (Attendance to be calculated based on this)
    areTheyEligibleForCasualLeave: {type: String},           // – Yes/No (Yes – Casual to be considered | No – Casual leave restricted)
    doj: {type: String},                    // (Date of Joining)
    dob: {type: String},                     // (Date of Birth)
    address: {type: String},
    email: {type: String},
    mobileNumber: {type: String},
    emergencyContactNo: {type: String},
    probationDuration: {type: String},
    salary: {type: String},               // (Break Up with deduction – Manual)        
    idCard: {type: String},                     // – Yes / No (If ‘Yes’ card to be generated)
    manageApplications: {type: String},           // Yes/No    //If Yes, List Country & University The user can only handle applications of these universities and country
    activeInactive: {type: String},                // – User
    teamLead: {type: String},   
    password: { type: String },
    confirmPassword: { type: String },  
    isDeleted: { type: Boolean, default: false },
  
    privileges: {type: String},  //(To be assigned by Super Admin) 
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})
export const Staff = mongoose.model('Staff', staffSchema)