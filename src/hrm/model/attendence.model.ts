import * as mongoose from 'mongoose'

export interface AttendenceDocument extends mongoose.Document{
    employeeId?: any;
    date?: Date;
    status?: string;
    clockIn?: Date;
    clockOut?: Date;
    late?: Date;
    earlyLeaving?: Date;
    totalWork?: any;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const attendenceSchema = new mongoose.Schema({

    employeeId: { type: mongoose.Types.ObjectId, ref: 'Staff' },
    date: {type: Date},
    status: {type: String},
    clockIn: {type: Date},
    clockOut: {type: Date},
    late: {type: Date},
    earlyLeaving: {type: Date},
    totalWork: {type: Number},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Attendence = mongoose.model("Attendence", attendenceSchema)