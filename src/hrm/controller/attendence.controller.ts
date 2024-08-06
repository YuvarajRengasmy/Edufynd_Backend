import { Attendence, AttendenceDocument } from '../model/attendence.model'
import { Staff, StaffDocument } from '../../model/staff.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import moment = require('moment');


var activity = "Attendence";




export const getAllAttendence = async (req, res) => {
    try {
        const data = await Attendence.find().sort({ _id: -1 })
      
        response(req, res, activity, 'Level-1', 'GetAll-Attendence', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Attendence', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleAttendence = async (req, res) => {
    try {
        const data = await Attendence.findOne({ _id: req.query._id })
  
        response(req, res, activity, 'Level-1', 'GetSingle-Attendence', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Attendence', false, 500, {}, errorMessage.internalServer, err.message)
    }
}



export const staffClockIn = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return response(req, res, 'activity', 'Level-3', 'Create-Attendence', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }

    try {
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

        return response(req, res, 'activity', 'Level-3', 'Create-Attendence', true, 200, { attendance: insertedData }, 'Check-in Start Work ');
    } catch (err) {
        console.error('Error during clock-in process:', err);
        return response(req, res, 'activity', 'Level-3', 'Create-Attendence', false, 500, {}, 'Internal server error.', err.message);
    }
};


// Array code 
// export const staffClockIn = async (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return response(req, res, 'activity', 'Level-3', 'Create-Attendence', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
//     }

//     try {
//         const staff = await Staff.findOne({ employeeId: req.body.employeeId });
//         console.log("Staff details:", staff);

//         if (!staff) {
//             return response(req, res, 'activity', 'Level-3', 'Create-Attendence', false, 422, {}, 'Staff member not found');
//         }

//         const currentDateTime = new Date();

//         // Check if there's already an attendance record for the day
//         const existingAttendance = await Attendence.findOne({
//             employeeId: staff._id,
//             date: { $eq: new Date().setHours(0, 0, 0, 0) } // Check for the current day's attendance
//         });

//         if (existingAttendance) {
//             // If the record already exists, just add the clock-in time to an array of clock-ins
//             await Attendence.updateOne(
//                 { _id: existingAttendance._id },
//                 { $push: { clockInTimes: currentDateTime } } // Assuming you have an array to hold multiple clock-ins
//             );
//             return response(req, res, 'activity', 'Level-3', 'Create-Attendence', true, 200, { attendance: existingAttendance }, 'Additional clock-in time recorded successfully.');
//         }

//         // Prepare a new attendance record
//         const attendanceDetails: AttendenceDocument = {
//             ...req.body,
//             employeeId: staff._id,
//             clockInTimes: [currentDateTime], // Use an array to hold multiple clock-ins
//             date: new Date().setHours(0, 0, 0, 0) // Set the date to the current day
//         };

//         const newAttendance = new Attendence(attendanceDetails);
//         const insertedData = await newAttendance.save();

//         return response(req, res, 'activity', 'Level-3', 'Create-Attendence', true, 200, { attendance: insertedData }, 'First clock-in time recorded successfully.');
//     } catch (err) {
//         console.error('Error during clock-in process:', err);
//         return response(req, res, 'activity', 'Level-3', 'Create-Attendence', false, 500, {}, 'Internal server error.', err.message);
//     }
// };



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

        console.log("bala", updatedAttendance)

        if (!updatedAttendance) {
            return response(req, res, 'activity', 'Level-3', 'Update-Department', false, 404, {}, 'Attendance record not found.');
        }

        // Calculate total work duration
        const clockInTime = moment(updatedAttendance.clockIn);
        const totalDuration = moment.duration(moment(clockOutTime).diff(clockInTime));
        
        // Total duration in minutes
        const totalWorkMinutes = totalDuration.asMinutes();

        // Convert minutes to hours and minutes
        const totalWorkHours = Math.floor(totalWorkMinutes / 60);
        const remainingMinutes = Math.floor(totalWorkMinutes % 60);

        // Update the attendance record with hours and minutes
        // updatedAttendance.totalWorkHours = totalWorkHours;
        // updatedAttendance.totalWorkMinutes = remainingMinutes;
         updatedAttendance.totalWork = totalWorkHours * 60 + remainingMinutes;

        await updatedAttendance.save();

        return response(req, res, 'activity', 'Level-2', 'Update-Department', true, 200, updatedAttendance, 'Check-Out Have A Nice Day.');
    } catch (err: any) {
        console.error('Error during clock-out process:', err);
        return response(req, res, 'activity', 'Level-3', 'Update-Department', false, 500, {}, 'Internal server error.', err.message);
    }
};



// Array code
// export let staffClockOut = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return response(req, res, 'activity', 'Level-3', 'Update-Department', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
//     }

//     try {
//         const attendenceDetails: AttendenceDocument = req.body;

//         // Fetch the attendance record by employeeId and the current date
//         const currentDate = new Date().setHours(0, 0, 0, 0); // Set time to the start of the day
//         const attendanceRecord = await Attendence.findOne({
//             employeeId: attendenceDetails.employeeId,
//             date: currentDate,
//         });

//         if (!attendanceRecord) {
//             return response(req, res, 'activity', 'Level-3', 'Update-Department', false, 404, {}, 'Attendance record not found.');
//         }

//         const clockOutTime = new Date();

//         // Update the attendance record with the new clock-out time
//         await Attendence.updateOne(
//             { _id: attendanceRecord._id },
//             { $push: { clockOutTimes: clockOutTime } } // Assuming you have an array to hold multiple clock-outs
//         );

//         // Re-fetch the updated attendance record to calculate the total work
//         const updatedAttendance = await Attendence.findById(attendanceRecord._id);

//         // Calculate total work duration based on all clock-ins and clock-outs
//         const clockInTimes = updatedAttendance.clockInTimes;
//         const clockOutTimes = updatedAttendance.clockOutTimes;

//         let totalWorkMinutes = 0;

//         for (let i = 0; i < clockInTimes.length && i < clockOutTimes.length; i++) {
//             const clockInTime = moment(clockInTimes[i]);
//             const clockOutTime = moment(clockOutTimes[i]);
//             totalWorkMinutes += moment.duration(clockOutTime.diff(clockInTime)).asMinutes();
//         }

//         // Convert minutes to hours and minutes
//         const totalWorkHours = Math.floor(totalWorkMinutes / 60);
//         const remainingMinutes = Math.floor(totalWorkMinutes % 60);

//         // Update the attendance record with total work hours
//         updatedAttendance.totalWork = totalWorkHours * 60 + remainingMinutes;

//         await updatedAttendance.save();

//         return response(req, res, 'activity', 'Level-2', 'Update-Department', true, 200, updatedAttendance, 'Check-Out Have A Nice Day.');
//     } catch (err) {
//         console.error('Error during clock-out process:', err);
//         return response(req, res, 'activity', 'Level-3', 'Update-Department', false, 500, {}, 'Internal server error.', err.message);
//     }
// };

export let getFilteredAttendence = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
       
        if (req.body.status) {
            andList.push({ status: req.body.status })
        }
        if (req.body.late) {
            andList.push({ late: req.body.late })
        }
        if (req.body.earlyLeaving) {
            andList.push({ earlyLeaving: req.body.earlyLeaving })
        }
        if (req.body.totalWork) {
            andList.push({ totalWork: req.body.totalWork })
        }
  
        findQuery = (andList.length > 0) ? { $and: andList } : {}
     
        const attendencetList = await Attendence.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const attendenceCount = await Attendence.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Attendence', true, 200, { attendencetList, attendenceCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Attendence', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let deleteAttendence = async (req, res, next) => {

    try {
        let id = req.query._id;
        const country = await Attendence.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Attendence', true, 200, country, 'Successfully Remove the Attendence Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Attendence', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export const calculateAttendance = async (req,res) => {
    try {
        const attendenceDetails: AttendenceDocument = req.body;

        // Fetch the staff by ID
        // const staff = await Staff.findById(attendenceDetails.employeeId);
        const staff = await Staff.findOne({ _id: req.query._id })

        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        const shiftTiming = staff.shiftTiming.split('-');
        const shiftStart = moment(shiftTiming[0], 'HH:mm'); // e.g., '09:00'
        const shiftEnd = moment(shiftTiming[1], 'HH:mm');   // e.g., '17:00'

        const clockIn = moment(attendenceDetails.clockIn);   // Actual clock-in time
        const clockOut = moment(attendenceDetails.clockOut); // Actual clock-out time

        // Calculate late time
        const late = clockIn.isAfter(shiftStart) ? clockIn.diff(shiftStart, 'minutes') : 0;

        // Calculate early leaving time
        const earlyLeaving = clockOut.isBefore(shiftEnd) ? shiftEnd.diff(clockOut, 'minutes') : 0;

        // Calculate total work time in hours
        const totalWork = clockOut.diff(clockIn, 'hours', true);

        console.log("567", clockIn, clockOut)

        // Determine attendance status
        const status = clockIn && clockOut ? 'Present' : 'Absent';

        // Create an attendance record
        const attendanceRecord = new Attendence({
            employeeId: staff._id,
            date: new Date(),
            status: status,
            clockIn: clockIn.toDate(),
            clockOut: clockOut.toDate(),
            late: late ? late : null,
            earlyLeaving: earlyLeaving ? earlyLeaving : null,
            totalWork: totalWork,
            createdOn: new Date(),
            createdBy: staff.employeeID,
        });

        // Save the attendance record to the database
        await attendanceRecord.save();

        return res.status(200).json({ message: 'Attendance calculated successfully', attendance: attendanceRecord });
    } catch (error) {
        console.error('Error calculating attendance:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// export const calculateAttendance = async (req, res) => {
//     console.log("balan")
//     try {
     
//         const attendenceDetails: AttendenceDocument = req.body;

//         // Fetch the staff by ID
//         const staff = await Staff.findById({_id:attendenceDetails.employeeId});

//         if (!staff) {
//             return res.status(404).json({ message: 'Staff member not found' });
//         }

//         const shiftTiming = staff.shiftTiming.split('-');
//         const shiftStart = moment(shiftTiming[0], 'HH:mm'); // e.g., '09:00'
//         const shiftEnd = moment(shiftTiming[1], 'HH:mm');   // e.g., '17:00'

//         const clockIn = moment(attendenceDetails.clockIn);   // Actual clock-in time
//         const clockOut = moment(attendenceDetails.clockOut); // Actual clock-out time

//         // Calculate late
//         const late = clockIn.isAfter(shiftStart) ? clockIn.diff(shiftStart, 'minutes') : 0;

//         // Calculate early leaving
//         const earlyLeaving = clockOut.isBefore(shiftEnd) ? shiftEnd.diff(clockOut, 'minutes') : 0;

//         // Calculate total work time in hours
//         const totalWork = clockOut.diff(clockIn, 'hours', true);

//         // Set attendance status
//         const status = clockIn && clockOut ? 'Present' : 'Absent';

//         // Create an attendance record
//         const attendanceRecord = new Attendence({
//             employeeId: staff._id,
//             date: new Date(),
//             status: status,
//             clockIn: clockIn.toDate(),
//             clockOut: clockOut.toDate(),
//             late: late ? moment.duration(late, 'minutes').asMilliseconds() : null,
//             earlyLeaving: earlyLeaving ? moment.duration(earlyLeaving, 'minutes').asMilliseconds() : null,
//             totalWork: moment.duration(totalWork, 'hours').asMilliseconds(),
//             createdOn: new Date(),
//             createdBy: staff.employeeID,
//         });

//         // Save the attendance record to the database
//         await attendanceRecord.save();

//         res.status(200).json({ message: 'Attendance calculated successfully', attendance: attendanceRecord });
//     } catch (error) {
//         console.error('Error calculating attendance:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };




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


