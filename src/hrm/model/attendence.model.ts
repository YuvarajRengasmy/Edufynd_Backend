import * as mongoose from 'mongoose'

export interface AttendenceDocument extends mongoose.Document{
    employeeId?: any;
    staff?: any;
    date?: Date;
    empName?: string;
    status?: string;
    clockIn?: Date;
    clockOut?: Date;
    late?: string;
    earlyLeaving?: string;
    totalWork?: string;


    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const attendenceSchema = new mongoose.Schema({

    // employeeId: { type: mongoose.Types.ObjectId, ref: 'Staff' },
    staff: { type: mongoose.Types.ObjectId, ref: 'Staff' },
    date: {type: Date},
    status: {type: String},
    empName: {type: String},
    clockIn: {type: Date},
    clockOut: {type: Date},
    late: {type: String},
    earlyLeaving: {type: String},
    totalWork: {type: String},


    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Attendence = mongoose.model("Attendence", attendenceSchema)