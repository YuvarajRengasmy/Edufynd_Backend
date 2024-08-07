import { User, UserDocument } from '../model/user.model'
import { validationResult } from 'express-validator'
import { response } from '../helper/commonResponseHandler'
import { clientError, errorMessage } from '../helper/ErrorMessage'

var activity = "User"


export const getAllUser = async(req, res, next)=>{
    try {
        const user = await User.find({isDeleted: false})
        response(req, res, activity,  "Level-1", "GetAll-User", true, 200, user, clientError.success.fetchedSuccessfully)
        
    } catch (err: any) {
        response(req, res, activity, "Level-1", 'GetAll-User', false, 500, {},  errorMessage.internalServer, err.message)
        
    }
}





// export const staffClockInn = async (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//     try {
//         // const staff = await Staff.findOne({ employeeId: req.body.employeeId });   //b
//         const staff = await Staff.findOne({ _id: req.query._id });
//         console.log("Staff detailsssss:", staff);

//         if (!staff) {
//             return response(req, res, activity, 'Level-3', 'Create-Attendence', false, 422, {}, 'Staff member not found');
//         }
//         const currentDateTime = new Date();

//         // Prepare attendance details
//         const attendanceDetails: AttendenceDocument = {
//             ...req.body,
//             employeeId: staff._id,  //b
//             empName: staff.empName,
//             clockIn: currentDateTime
//         };

//         const newAttendance = new Attendence(attendanceDetails);
//         const insertedData = await newAttendance.save();

//         return response(req, res, activity, 'Level-3', 'Create-Attendence', true, 200, { attendance: insertedData }, 'Check-in Start Work ');
//     } catch (err) {
//         console.error('Error during clock-in process:', err);
//         return response(req, res, activity, 'Level-3', 'Create-Attendence', false, 500, {}, 'Internal server error.', err.message);
//     }
// }
//     else {
//         return response(req, res, activity, 'Level-3', 'Update-Check In', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
//     }
// };


// export let staffClockOutT = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {

//         try {
//             const attendenceDetails: AttendenceDocument = req.body;

//             // Update the attendance record with clock-out time
//             const clockOutTime = new Date();
//             const updatedAttendance = await Attendence.findOneAndUpdate(
//                  { _id: attendenceDetails._id },
//                 // { _id: req.body._id },
//                 { $set: { clockOut: clockOutTime } },
//                 { new: true } // Return the updated document
//             );

//             console.log("bala", updatedAttendance)

//             if (!updatedAttendance) {
//                 return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 404, {}, 'Attendance record not found.');
//             }

//             // Calculate total work duration
//             const clockInTime = moment(updatedAttendance.clockIn);
//             const totalDuration = moment.duration(moment(clockOutTime).diff(clockInTime));

//             // Total duration in minutes
//             const totalWorkMinutes = totalDuration.asMinutes();

//             // Convert minutes to hours and minutes
//             const totalWorkHours = Math.floor(totalWorkMinutes / 60);
//             const remainingMinutes = Math.floor(totalWorkMinutes % 60);

//             // Update the attendance record with hours and minutes
//             // updatedAttendance.totalWorkHours = totalWorkHours;
//             // updatedAttendance.totalWorkMinutes = remainingMinutes;
//             updatedAttendance.totalWork = totalWorkHours * 60 + remainingMinutes;

//             await updatedAttendance.save();

//             return response(req, res, activity, 'Level-2', 'Update-Check Out', true, 200, updatedAttendance, 'Check-Out Have A Nice Day.');
//         } catch (err: any) {
//             console.error('Error during clock-out process:', err);
//             return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 500, {}, 'Internal server error.', err.message);
//         }
//     }
//     else {
//         return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
//     }
// };


// export const calculateAttendance = async (req, res) => {
//     try {
//         const attendenceDetails: AttendenceDocument = req.body;

//         // Fetch the staff by ID
//         // const staff = await Staff.findById(attendenceDetails.employeeId);
//         const staff = await Staff.findOne({ _id: req.query._id })

//         if (!staff) {
//             return res.status(404).json({ message: 'Staff member not found' });
//         }

//         const shiftTiming = staff.shiftTiming.split('-');
//         const shiftStart = moment(shiftTiming[0], 'HH:mm'); // e.g., '09:00'
//         const shiftEnd = moment(shiftTiming[1], 'HH:mm');   // e.g., '17:00'

//         const clockIn = moment(attendenceDetails.clockIn);   // Actual clock-in time
//         const clockOut = moment(attendenceDetails.clockOut); // Actual clock-out time

//         // Calculate late time
//         const late = clockIn.isAfter(shiftStart) ? clockIn.diff(shiftStart, 'minutes') : 0;

//         // Calculate early leaving time
//         const earlyLeaving = clockOut.isBefore(shiftEnd) ? shiftEnd.diff(clockOut, 'minutes') : 0;

//         // Calculate total work time in hours
//         const totalWork = clockOut.diff(clockIn, 'hours', true);

//         console.log("567", clockIn, clockOut)

//         // Determine attendance status
//         const status = clockIn && clockOut ? 'Present' : 'Absent';

//         // Create an attendance record
//         const attendanceRecord = new Attendence({
//             employeeId: staff._id,
//             date: new Date(),
//             status: status,
//             clockIn: clockIn.toDate(),
//             clockOut: clockOut.toDate(),
//             late: late ? late : null,
//             earlyLeaving: earlyLeaving ? earlyLeaving : null,
//             totalWork: totalWork,
//             createdOn: new Date(),
//             createdBy: staff.employeeID,
//         });

//         // Save the attendance record to the database
//         await attendanceRecord.save();

//         return res.status(200).json({ message: 'Attendance calculated successfully', attendance: attendanceRecord });
//     } catch (error) {
//         console.error('Error calculating attendance:', error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// export let staffClockInC = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const existingStaff = await Staff.findOne({ employeeId: req.body.employeeId });

//             if (existingStaff) {
//                 const attendenceDetails: AttendenceDocument = req.body;

//                 // Save the new program
//                 const clockOutTime = new Date();
//                 attendenceDetails.clockIn = clockOutTime
//                 attendenceDetails.employeeId = attendenceDetails._id
//                 const newStaff = new Attendence(attendenceDetails);
//                 let insertedData = await newStaff.save();

//                 response(req, res, activity, 'Level-2', 'Update-Check Out', true, 200, insertedData, clientError.success.savedSuccessfully);
//             } else {

//                 response(req, res, activity, 'Level-3', 'Update-Check Out', true, 422, {}, 'Check-in Start Work ');
//             }
//         } catch (err: any) {
//             console.log(err);
//             response(req, res, activity, 'Level-3', 'Update-Check Out', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     } else {

//         return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
//     }
// };
