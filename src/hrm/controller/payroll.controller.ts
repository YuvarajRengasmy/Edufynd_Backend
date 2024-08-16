import { PayRoll, PayRollDocument } from '../model/payroll.model'
import { Attendence, AttendenceDocument } from '../model/attendence.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { toWords } from 'number-to-words';


var activity = "PayRoll";


export const getAllPayRoll = async (req, res) => {
    try {
        const data = await PayRoll.find().sort({ _id: -1 })

        response(req, res, activity, 'Level-1', 'GetAll-PayRoll', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-PayRoll', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSinglePayRoll = async (req, res) => {
    try {
        const data = await PayRoll.findOne({ _id: req.query._id })

        response(req, res, activity, 'Level-1', 'GetSingle-PayRoll', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-PayRoll', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

export const getViewStaffPayRoll = async (req, res) => {
    try {
        const data = await PayRoll.findOne({ staffId: req.query.staffId })

        response(req, res, activity, 'Level-1', 'GetSingle-Staff PayRoll', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Staff PayRoll', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createPayRolll = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const payRollDetails: PayRollDocument = req.body;

            // Ensure allowance and deduction are arrays, even if they're empty
            const allowanceComponents = payRollDetails.allowance || [];
            const deductionComponents = payRollDetails.deduction || [];

            // Calculate total allowance
            let totalAllowance = 0;
            allowanceComponents.forEach(component => {
                totalAllowance += Number(component.amount);
            });
            // Calculate total deduction
            let totalDeduct = 0;
            deductionComponents.forEach(component => {
                totalDeduct += Number(component.amount);
            });

            // Calculate gross salary
            const ctc = Number((Number(payRollDetails.basicAllowance || 0) + Number(payRollDetails.hra || 0) + Number(payRollDetails.conveyance || 0) + Number(totalAllowance)));
            payRollDetails.grossSalary = ctc;



            // Performance Allowance: 10% of Gross Salary
            const performanceAllowance = payRollDetails.grossSalary * 0.1;

            // Add PF deduction to the total deduction
            const deduction = Number((Number(payRollDetails.pf || 0) + Number(payRollDetails.performanceDeduction || 0) + Number(payRollDetails.taxDeduction || 0) + Number(totalDeduct)));
            payRollDetails.totalDeduction = deduction;



            // Calculate net salary
            const netSalaryWithDeductions = Number(payRollDetails.grossSalary - payRollDetails.totalDeduction);

            const wordsinRupees = toWords(netSalaryWithDeductions).replace(/,/g, '') + ' only';


            // Calculate daily gross and net salary
            const dailyGrossSalary = payRollDetails.grossSalary / 30;
            // const salaryForPresentDays = dailyGrossSalary * (payRollDetails.presentDays || 0);

            const dailyNetSalary = netSalaryWithDeductions / 30;
            // const finalSalaryWithPerformanceDeduction = dailyNetSalary * (payRollDetails.presentDays || 0) - (payRollDetails.professionalTax || 0);


            // Save to database
            const payroll = new PayRoll({
                ...payRollDetails,
                otherAllowance: totalAllowance,
                otherDeduction: totalDeduct,
                netSalary: netSalaryWithDeductions,
                netInWords: wordsinRupees
            });

            await payroll.save();
            response(req, res, activity, 'Level-1', 'Create-PayRoll', true, 200, payroll, "Payroll created successfully");
        } catch (err) {

            response(req, res, activity, 'Level-2', 'Create-PayRoll', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-PayRoll', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

export let createPayRoll = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const payRollDetails: PayRollDocument = req.body;

            // Ensure allowance and deduction are arrays, even if they're empty
            const allowanceComponents = payRollDetails.allowance || [];
            const deductionComponents = payRollDetails.deduction || [];

            // Calculate total allowance
            let totalAllowance = 0;
            allowanceComponents.forEach(component => {
                totalAllowance += Number(component.amount);
            });
            // Calculate total deduction
            let totalDeduct = 0;
            deductionComponents.forEach(component => {
                totalDeduct += Number(component.amount);
            });

            // Calculate gross salary
            const ctc = Number((Number(payRollDetails.basicAllowance || 0) + Number(payRollDetails.hra || 0) + Number(payRollDetails.conveyance || 0) + Number(totalAllowance)));
            payRollDetails.grossSalary = ctc;

            // Performance Allowance: 10% of Gross Salary
            const performanceAllowance = payRollDetails.grossSalary * 0.1;

            // Add PF deduction to the total deduction
            const deduction = Number((Number(payRollDetails.pf || 0) + Number(payRollDetails.performanceDeduction || 0) + Number(payRollDetails.taxDeduction || 0) + Number(totalDeduct)));
            payRollDetails.totalDeduction = deduction;

            // Calculate net salary
            const netSalaryWithDeductions = Number(payRollDetails.grossSalary - payRollDetails.totalDeduction);

            const wordsinRupees = toWords(netSalaryWithDeductions).replace(/,/g, '') + ' only';

            // Attendeance Calculation
            const attendenceDetails: AttendenceDocument = req.body;
            const active = await Attendence.findOne({ employeeId: req.query.employeeId });

            if (!active) {
                return response(req, res, activity, 'Level-3', 'Employee Not Found', false, 404, {}, "Not Found the Employee");
            }

            let startDate = new Date(req.body.startDate);
            let endDate = new Date(req.body.endDate);
            // Attendance Calculation
            const attendence = await Attendence.find({employeeId: req.query.employeeId, date: { $gte: startDate, $lte: endDate }});
            // Calculate the number of days between startDate and endDate (inclusive)
            let presentDays = 0;
            let absentDays = 0;
            let sundayCount = 0;
            let sundays = [];

            const numberOfDays = Math.ceil((Number(endDate) - Number(startDate)) / (24 * 60 * 60 * 1000)) + 1;
            attendence.forEach(att => {
                if (att.status === "Present") {
                    presentDays++;
                } else {
                    absentDays++; // Consider as Absent if no record found for the date
                }
            });

            let currentDate = new Date(startDate);
            endDate = new Date(endDate); // Convert endDate to a Date object
            // Iterate through each date in the range
            while (currentDate <= endDate) {
                // Check if the current date is a Sunday (getDay() returns 0 for Sunday)
                if (currentDate.getDay() === 0) {
                    sundayCount++;
                    sundays.push(new Date(currentDate)); // Optional: store the Sunday date
                }
                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
            }

            const absent = numberOfDays - presentDays - sundayCount
            presentDays = presentDays + sundayCount

            // Save to database
            const payroll = new PayRoll({
                ...payRollDetails,
                otherAllowance: totalAllowance,
                otherDeduction: totalDeduct,
                netSalary: netSalaryWithDeductions,
                netInWords: wordsinRupees,
                payableDays: presentDays,
                lopDays: absent
            });

            await payroll.save();
            response(req, res, activity, 'Level-1', 'Create-PayRoll', true, 200, payroll, "Payroll created successfully");
        } catch (err) {
            console.log(err)
            response(req, res, activity, 'Level-2', 'Create-PayRoll', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-PayRoll', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let updatePayRoll = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const payRollDetails: PayRollDocument = req.body;
            const updateData = await PayRoll.findOneAndUpdate({ _id: payRollDetails._id }, {
                $set: {
                    basicAllowance: payRollDetails.basicAllowance,
                    hra: payRollDetails.hra,
                    conveyance: payRollDetails.conveyance,
                    otherAllowance: payRollDetails.otherAllowance,
                    pf: payRollDetails.pf,
                    description: payRollDetails.description,
                    performanceDeduction: payRollDetails.performanceDeduction,
                    taxDeduction: payRollDetails.taxDeduction,
                    grossSalary: payRollDetails.grossSalary,
                    totalDeduction: payRollDetails.totalDeduction,
                    netSalary: payRollDetails.netSalary,
                    uploadDocument: payRollDetails.uploadDocument,

                    modifiedOn: new Date(),

                }
            });
            response(req, res, activity, 'Level-1', 'Update-PayRoll', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-PayRoll', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let deletePayRoll = async (req, res, next) => {

    try {
        let id = req.query._id;
        const country = await PayRoll.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the PayRoll', true, 200, country, 'Successfully Remove the PayRoll Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredPayRoll = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })

        if (req.body.basicAllowance) {
            andList.push({ basicAllowance: req.body.basicAllowance })
        }
        if (req.body.conveyance) {
            andList.push({ conveyance: req.body.conveyance })
        }
        if (req.body.otherAllowance) {
            andList.push({ otherAllowance: req.body.otherAllowance })
        }
        if (req.body.grossSalary) {
            andList.push({ grossSalary: req.body.grossSalary })
        }
        if (req.body.netSalary) {
            andList.push({ netSalary: req.body.netSalary })
        }
        if (req.body.hra) {
            andList.push({ hra: req.body.hra })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const payRollList = await PayRoll.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const payRollCount = await PayRoll.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter PayRoll', true, 200, { payRollList, payRollCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


// additionalComponents: { type: Map, of: mongoose.Schema.Types.Mixed }, // New field to store dynamic components and // Allows for both Number and String types




