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


export let updateAttendence = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const attendenceDetails: AttendenceDocument = req.body;
            const updateData = await Attendence.findOneAndUpdate({ _id: attendenceDetails._id }, {
                $set: {
                    date: attendenceDetails.date,
                    status: attendenceDetails.status,
                    empName: attendenceDetails.empName,
                    clockIn: attendenceDetails.clockIn,
                    clockOut: attendenceDetails.clockOut,
                    late: attendenceDetails.late,
                    earlyLeaving: attendenceDetails.earlyLeaving,
                    totalWork: attendenceDetails.totalWork,

                    modifiedOn: new Date(),

                }
            });
            response(req, res, activity, 'Level-1', 'Update-Attendence', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-Attendence', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Attendence', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let getFilteredAttendence = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        //  andList.push({ status: "present" })
        if (req.body.employeeId) {
            andList.push({ employeeId: req.body.employeeId })
        }
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

        const attendencetList = await Attendence.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate("employeeId", { empName: 1 })
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


export const staffClockIn = async (req, res) => {
    try {
        const { staffId } = req.body;
        const attendenceDetails: AttendenceDocument = req.body;
        const today = moment().startOf('day').toDate();
        const shiftStart = moment().set({ hour: 10, minute: 0, second: 0 }).toDate();
        const shiftEnd = moment().set({ hour: 19, minute: 0, second: 0 }).toDate();

        // Check if there's already an attendance record for today
        let attendance = await Attendence.findOne({ staff: staffId, date: today, });


        if (attendance) {
            return response(req, res, activity, 'Level-3', 'Update-Check In', false, 422, {}, "Already clocked in today");
        }

        const clockInTime = new Date();
        let lateDuration = 0;

        // Calculate late duration if clocking in after shift start time
        if (clockInTime > shiftStart) {
            lateDuration = moment(clockInTime).diff(moment(shiftStart), 'minutes');
        }
        const formattedLateDuration = `${Math.floor(lateDuration / 60)}h ${lateDuration % 60}min`;

        attendance = new Attendence({ ...attendenceDetails, clockIn: clockInTime, date: today, status: 'Present', late: formattedLateDuration })

        await attendance.save();
        return response(req, res, activity, 'Level-2', 'Update-Check In', true, 200, attendance, "Clocked in successfully");
    } catch (err) {
        return response(req, res, activity, 'Level-3', 'Update-Check In', false, 500, {}, 'Internal server error.', err.message);
    }
};


export const staffClockOut = async (req, res) => {
 
    try {
        const { staffId } = req.body;
        console.log("77", staffId)
        const today = moment().startOf('day').toDate();
        console.log("gg", today)

       
        const shiftEnd = moment().set({ hour: 19, minute: 0, second: 0 }).toDate();

        // Find today's attendance record
        let attendance = await Attendence.findOne({ staff: staffId, date: today });

        console.log("kkk", attendance)

        if (!attendance) {
            return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 422, {}, "No clock in record found for today");
        }

        const clockOutTime = new Date();
        let earlyLeavingDuration = 0;

        // Calculate early leaving duration if clocking out before shift end time
        if (clockOutTime < shiftEnd) {
            earlyLeavingDuration = moment(shiftEnd).diff(moment(clockOutTime), 'minutes');
        }
        const formattedEarlyLeavingDuration = `${Math.floor(earlyLeavingDuration / 60)}h ${earlyLeavingDuration % 60}min`;

        // Update the clockOut time
        attendance.clockOut = clockOutTime;

        // Calculate the difference between clockIn and clockOut
        const diffInMinutes = moment(attendance.clockOut).diff(moment(attendance.clockIn), 'minutes');
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;


        // Format the total work duration as "Xh Ymin"
        attendance.totalWork = `${hours}h ${minutes}min`;
        attendance.earlyLeaving = formattedEarlyLeavingDuration;
        await attendance.save();

        return response(req, res, activity, 'Level-2', 'Update-Check Out', true, 200, attendance, "Clocked out successfully");
    } catch (err) {
        return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 500, {}, 'Internal server error.', err.message);
    }
};





///////
//totalwork correction
export const staffClockOutt = async (req, res) => {
    try {
        const { staffId } = req.body;
        console.log("77", staffId)
        const today = moment().startOf('day').toDate();
        const shiftEnd = moment().set({ hour: 19, minute: 0, second: 0 }).toDate();

        // Find today's attendance record
        let attendance = await Attendence.findOne({ staff: staffId, date: today });

        if (!attendance) {
            return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 422, {}, "No clock in record found for today");
        }

        const clockOutTime = new Date();
        let earlyLeavingDuration = 0;

        // Calculate early leaving duration if clocking out before shift end time
        if (clockOutTime < shiftEnd) {
            earlyLeavingDuration = moment(shiftEnd).diff(moment(clockOutTime), 'minutes');
        }

        const formattedEarlyLeavingDuration = `${Math.floor(earlyLeavingDuration / 60)}h ${earlyLeavingDuration % 60}min`;

        // Update the clockOut time and calculate total work hours
        attendance.clockOut = clockOutTime
        const diff = moment(attendance.clockOut).diff(moment(attendance.clockIn), 'hours', true);
        const hours = `${(diff % 60).toFixed(2)}min`;
        // const hours = `${Math.floor(diff / 60)}h ${(diff % 60).toFixed(2)}min`;
        attendance.totalWork = hours;
        attendance.earlyLeaving = formattedEarlyLeavingDuration;
        await attendance.save();

        return response(req, res, activity, 'Level-2', 'Update-Check Out', true, 200, attendance, "Clocked out successfully");
    } catch (err) {
        return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 500, {}, 'Internal server error.', err.message);
    }
};




export const staffClockInn = async (req, res) => {
    try {
        const { staffId } = req.body;
        console.log("jjj", staffId)
        const attendanceDetails: AttendenceDocument = req.body;
        // const today = moment().startOf('day').toDate();
        const today = new Date()

        //   // Set today to start of day in UTC to avoid timezone offset issues
        //   const today = moment.utc().startOf('day').toDate();

        const shiftStart = moment().set({ hour: 10, minute: 0, second: 0 }).toDate();
        const lastAttendance = await Attendence.findOne({ staff: staffId }).sort({ clockIn: -1 });

        console.log("ddd", today)
        // Check if there's already an attendance record for today
        let attendance = await Attendence.findOne({ staff: staffId, date: today });

        if (attendance) {
            return response(req, res, activity, 'Level-3', 'Update-Check In', false, 422, {}, "Already clocked in today");
        }
        const clockInTime = new Date();
        let lateDuration = 0;

        // Calculate late duration if clocking in after shift start time
        if (clockInTime > shiftStart) {
            lateDuration = moment(clockInTime).diff(moment(shiftStart), 'minutes');
        }
        const formattedLateDuration = `${Math.floor(lateDuration / 60)}h ${lateDuration % 60}min`;

        // Create a new attendance record with status "Present"
        attendance = new Attendence({
            ...attendanceDetails,
            clockIn: clockInTime,
            date: today,
            status: 'Present',
            late: formattedLateDuration
        })

        await attendance.save();
        Attendence.find().sort({ date: -1 })

        // Automatically mark previous days as "Absent" if no clockIn/clockOut record exists

        console.log("qq", lastAttendance)

        if (lastAttendance) {
            const lastDate = moment(lastAttendance.clockIn,'DD.MM.YYYY').startOf('day');
            const currentDate = moment(today, 'DD.MM.YYYY').startOf('day');

            console.log("55", lastDate)
            console.log("44", currentDate)

            // Generate all dates between lastDate and today, excluding today
            const missingDates = [];
            for (let date = lastDate.clone().add(1, 'day'); date.isBefore(currentDate); date.add(1, 'day')) {
                missingDates.push(date.clone().toISOString(true)); // Use toISOString(true) to keep the timezone
            }

            console.log("88", missingDates)
            // Insert "Absent" records for missing dates, checking if there was no clockIn
            for (const datee of missingDates) {
                console.log("lll", datee)
                const existingRecord = await Attendence.findOne({ staff: staffId, date: datee });
                if (!existingRecord) {
                    await Attendence.create({ ...attendanceDetails,
                        staff: staffId,
                        date: new Date(datee),
                        status: 'Absent'
                    });
                }
            }
        }

        return response(req, res, activity, 'Level-2', 'Update-Check In', true, 200, attendance, "Clocked in successfully");
    } catch (err) {
        console.log(err)
        return response(req, res, activity, 'Level-3', 'Update-Check In', false, 500, {}, 'Internal server error.', err.message);
    }
};


