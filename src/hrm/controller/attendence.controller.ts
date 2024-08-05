import { Attendence, AttendenceDocument } from '../model/attendence.model'
import { Staff, StaffDocument } from '../../model/staff.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import moment = require('moment');


var activity = "Attendence";


export const staffClockIn = async (req, res, next) => {
    console.log("Initiating clock-in process");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return response(req, res, 'activity', 'Level-3', 'Create-Attendence', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }

    try {
        // const staff = await Staff.findById({});
        const staff = await Staff.findOne({ employeeId: req.body.employeeId });
        console.log("Staff details:", staff);

        if (!staff) {
            return response(req, res, 'activity', 'Level-3', 'Create-Attendence', false, 422, {}, 'Staff member not found');
        }

        const currentDateTime = new Date();

        // Prepare attendance details
        const attendanceDetails: AttendenceDocument = {
            ...req.body,
            employeeId: staff._id,
            clockIn: currentDateTime
        };

        const newAttendance = new Attendence(attendanceDetails);
        const insertedData = await newAttendance.save();

        return response(req, res, 'activity', 'Level-3', 'Create-Attendence', true, 200, { attendance: insertedData }, 'Attendance recorded successfully.');
    } catch (err) {
        console.error('Error during clock-in process:', err);
        return response(req, res, 'activity', 'Level-3', 'Create-Attendence', false, 500, {}, 'Internal server error.', err.message);
    }
};



export let staffClockOut = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(req, res, 'activity', 'Level-3', 'Update-Department', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }

    try {
        const attendenceDetails: AttendenceDocument = req.body;

        // Update the attendance record with clock-out time
        const clockOutTime = new Date();
        const updatedAttendance = await Attendence.findOneAndUpdate(
            { _id: attendenceDetails._id },
            { $set: { clockOut: clockOutTime } },
            { new: true } // Return the updated document
        );

        if (!updatedAttendance) {
            return response(req, res, 'activity', 'Level-3', 'Update-Department', false, 404, {}, 'Attendance record not found.');
        }

        // Calculate total work hours
        const clockInTime = moment(updatedAttendance.clockIn);
        const totalWorkHours = moment.duration(moment(clockOutTime).diff(clockInTime)).asHours(); // Calculate total work hours including fractions

        // Update totalWork in the attendance record
        updatedAttendance.totalWork = moment.duration(totalWorkHours, 'hours').asMilliseconds()
        await updatedAttendance.save();

        return response(req, res, 'activity', 'Level-2', 'Update-Department', true, 200, updatedAttendance, 'Clock-out recorded successfully and total work hours calculated.');
    } catch (err: any) {
        console.error('Error during clock-out process:', err);
        return response(req, res, 'activity', 'Level-3', 'Update-Department', false, 500, {}, 'Internal server error.', err.message);
    }
};




export const calculateDailyHours = async (req, res) => {
    try {
        const { staffId, date } = req.body;

        // Fetch the attendance record for the given staff ID and date
        const attendanceRecord = await Attendence.findOne({
            employeeId: staffId,
            date: moment(date).startOf('day').toDate() // Ensure date is only for the specified day
        });

        if (!attendanceRecord) {
            return res.status(404).json({ message: 'Attendance record not found for the given date' });
        }

        if (!attendanceRecord.clockIn || !attendanceRecord.clockOut) {
            return res.status(400).json({ message: 'Incomplete clock-in or clock-out times' });
        }

        // Calculate the total hours worked
        const clockInTime = moment(attendanceRecord.clockIn);
        const clockOutTime = moment(attendanceRecord.clockOut);

        const totalWorkHours = clockOutTime.diff(clockInTime, 'hours', true); // Calculate total work hours including fractions

        // Optional: Update the total work in the attendance record
        attendanceRecord.totalWork = moment.duration(totalWorkHours, 'hours').asMilliseconds();
        await attendanceRecord.save();

        res.status(200).json({
            message: 'Total hours calculated successfully',
            totalWorkHours,
            clockInTime: attendanceRecord.clockIn,
            clockOutTime: attendanceRecord.clockOut
        });
    } catch (err) {
        console.error('Error calculating total work hours:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};



export const calculateAttendance = async (req, res) => {
    try {
        const { staffId, clockInTime, clockOutTime } = req.body;

        // Fetch the staff by ID
        const staff = await Staff.findById(staffId);

        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        const shiftTiming = staff.shiftTiming.split('-');
        const shiftStart = moment(shiftTiming[0], 'HH:mm'); // e.g., '09:00'
        const shiftEnd = moment(shiftTiming[1], 'HH:mm');   // e.g., '17:00'

        const clockIn = moment(clockInTime);   // Actual clock-in time
        const clockOut = moment(clockOutTime); // Actual clock-out time

        // Calculate late
        const late = clockIn.isAfter(shiftStart) ? clockIn.diff(shiftStart, 'minutes') : 0;

        // Calculate early leaving
        const earlyLeaving = clockOut.isBefore(shiftEnd) ? shiftEnd.diff(clockOut, 'minutes') : 0;

        // Calculate total work time in hours
        const totalWork = clockOut.diff(clockIn, 'hours', true);

        // Set attendance status
        const status = clockInTime && clockOutTime ? 'Present' : 'Absent';

        // Create an attendance record
        const attendanceRecord = new Attendence({
            employeeId: staff._id,
            date: new Date(),
            status: status,
            clockIn: clockIn.toDate(),
            clockOut: clockOut.toDate(),
            late: late ? moment.duration(late, 'minutes').asMilliseconds() : null,
            earlyLeaving: earlyLeaving ? moment.duration(earlyLeaving, 'minutes').asMilliseconds() : null,
            totalWork: moment.duration(totalWork, 'hours').asMilliseconds(),
            createdOn: new Date(),
            createdBy: staff.employeeID,
        });

        // Save the attendance record to the database
        await attendanceRecord.save();

        res.status(200).json({ message: 'Attendance calculated successfully', attendance: attendanceRecord });
    } catch (error) {
        console.error('Error calculating attendance:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




// export let staffClockOut = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try{
          
//             const attendenceDetails: AttendenceDocument = req.body;
//             const updateData = await Attendence.findOneAndUpdate({ _id: attendenceDetails._id }, {
//                 $set: {  
//                     clockOut:  new Date()
//                 }
//             });
//               // Calculate the total hours worked
//         const clockInTime = moment(attendenceDetails.clockIn);
//         const clockOutTime = moment(attendenceDetails.clockOut);

//         const totalWorkHours = clockOutTime.diff(clockInTime, 'hours', true); // Calculate total work hours including fractions

//         // Optional: Update the total work in the attendance record
//         attendenceDetails.totalWork = moment.duration(totalWorkHours, 'hours').asMilliseconds();
//         await attendanceRecord.save();
//             response(req, res, activity, 'Level-2', 'Update-Department', true, 200, updateData, clientError.success.updateSuccess);
//         }
//         catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Update-Department', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Update-Department', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }







// export let staffClockIn = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const attendenceDetails: AttendenceDocument = req.body;
//             const currentDateTime = new Date();

//          attendenceDetails.clockIn = currentDateTime;
//             const createData = new Attendence(attendenceDetails);
//             let insertData = await createData.save();
//             response(req, res, activity, 'Level-2', 'Create-Country', true, 200, insertData, clientError.success.savedSuccessfully);
//         } catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Create-Country', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     } else {
//         response(req, res, activity, 'Level-3', 'Create-Country', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// };

// export let staffClockIn = async (req, res, next) => {
//   console.log("sehat")
//     const errors = validationResult(req);

//     if (errors.isEmpty()) {
//         try {
//             const staff = await Staff.findById({ _id: req.query.employeeId })
//             console.log("balan", staff)
//             if(staff){
//                 const attendenceDetails: AttendenceDocument = req.body;
//                 const createData = new Attendence(attendenceDetails);
//                 const currentDateTime = new Date();

//                 attendenceDetails.clockIn = currentDateTime;
//                 let insertData = await createData.save();

//             response(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', true, 200, {staff: insertData}, 'Attendence created successfully by SuperAdmin.');
//         }else {
//                 response(req, res, activity, 'Level-3', 'Create-Attendence', true, 422, {}, 'Staff member not found');
//             }
//         } catch (err: any) {
//             console.log(err)
//             response(req, res, activity, 'Level-3', 'Create-Attendence', false, 500, {}, 'Internal server error.', err.message);
//         }
//     } else {
//         response(req, res, activity, 'Level-3','Create-Attendence', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
//     }
// };


