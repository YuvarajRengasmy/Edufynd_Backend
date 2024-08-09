import { PayRoll, PayRollDocument } from '../model/payroll.model'
import { Staff, StaffDocument } from '../../model/staff.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


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




// export let createPayRoll = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const payRollDetails: PayRollDocument = req.body;

//         // Ensure additionalComponents is an object, even if it's empty
//         const additionalComponents = payRollDetails.additionalComponents || {};

//         const allowance = (additionalComponents["transportAllowance"] || 0) +
//             (additionalComponents["leaveTravelAllowance"] || 0) +
//             (additionalComponents["medicalAllowance"] || 0) +
//             (additionalComponents["specialAllowance"] || 0)

//         payRollDetails.otherAllowance = allowance

//         const ctc = payRollDetails.houseRent + payRollDetails.conveyance + allowance

//         payRollDetails.grossSalary = ctc

//         // Performance Allowance: 10% of Gross Salary
//         const performanceAllowance = payRollDetails.grossSalary * 0.1;

//         // Deductions
//         const Deduction = (payRollDetails.taxDeduction || 0) +
//             (additionalComponents["professionalTax"] || 0) +
//             (payRollDetails.pf || 0) +
//             (additionalComponents["esi"] || 0);

//         payRollDetails.totalDeduction = Deduction


//         // Net Salary before deductions
//         const netSalaryWithDeductions = payRollDetails.grossSalary - Deduction;


//         // Salary Calculation Based on Attendance
//         const dailyGrossSalary = payRollDetails.grossSalary / 30;
//         const salaryForPresentDays = dailyGrossSalary * (additionalComponents["presentDays"] || 0);

//         const finalSalaryWithoutPerformanceDeduction = salaryForPresentDays - (additionalComponents["professionalTax"] || 0);

//         // With Performance Allowance Deduction
//         const dailyNetSalary = netSalaryWithDeductions / 30;
//         const finalSalaryWithPerformanceDeduction = dailyNetSalary * (additionalComponents["presentDays"] || 0) - (additionalComponents["professionalTax"] || 0);

//         // Save to database
//         const payroll = new PayRoll({
//             ...payRollDetails,
//             // performanceAllowance,
//             grossSalary: ctc,
//             otherAllowance: allowance,
//             netSalary: netSalaryWithDeductions
//         });

//         await payroll.save();
//         response(req, res, activity, 'Level-1', 'Create-PayRoll', true, 200, payroll,  "Payroll created successfully");
//         } catch (err: any) {
//             response(req, res, activity, 'Level-2', 'Create-PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     } else {
//         response(req, res, activity, 'Level-3', 'Create-PayRoll', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// };



export let updatePayRoll = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const payRollDetails: PayRollDocument = req.body;
            const updateData = await PayRoll.findOneAndUpdate({ _id: payRollDetails._id }, {
                $set: {
                    houseRent: payRollDetails.houseRent,
                    conveyance: payRollDetails.conveyance,
                    otherAllowance: payRollDetails.otherAllowance,
                    pf: payRollDetails.pf,
                    description: payRollDetails.description,
                    
                    taxDeduction: payRollDetails.taxDeduction,
                    grossSalary: payRollDetails.grossSalary,
                    totalDeduction: payRollDetails.totalDeduction,
                    netSalary: payRollDetails.netSalary,
                    uploadDocument: payRollDetails.uploadDocument,

                    modifiedOn: new Date(),

                }
            });
            response(req, res, activity, 'Level-2', 'Update-PayRoll', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
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

        if (req.body.houseRent) {
            andList.push({ houseRent: req.body.houseRent })
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
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const payRollList = await PayRoll.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const payRollCount = await PayRoll.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter PayRoll', true, 200, { payRollList, payRollCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


////////


// export const calculateSalary = async (req, res) => {
//     try {
//         const payRollDetails: PayRollDocument = req.body;

//         // Ensure additionalComponents is an object, even if it's empty
//         const additionalComponents = payRollDetails.additionalComponents || {};

//         const allowance = (additionalComponents["transportAllowance"] || 0) +
//             (additionalComponents["leaveTravelAllowance"] || 0) +
//             (additionalComponents["medicalAllowance"] || 0) +
//             (additionalComponents["specialAllowance"] || 0)

//         payRollDetails.otherAllowance = allowance

//         const ctc = payRollDetails.houseRent + payRollDetails.conveyance + allowance

//         payRollDetails.grossSalary = ctc

//         // Performance Allowance: 10% of Gross Salary
//         const performanceAllowance = payRollDetails.grossSalary * 0.1;

//         // Deductions
//         const Deduction = (payRollDetails.taxDeduction || 0) +
//             (additionalComponents["professionalTax"] || 0) +
//             (payRollDetails.pf || 0) +
//             (additionalComponents["esi"] || 0);

//         payRollDetails.totalDeduction = Deduction


//         // Net Salary before deductions
//         const netSalaryBeforeDeductions = payRollDetails.grossSalary - Deduction;


//         // Salary Calculation Based on Attendance
//         const dailyGrossSalary = payRollDetails.grossSalary / 30;
//         const salaryForPresentDays = dailyGrossSalary * (additionalComponents["presentDays"] || 0);

//         const finalSalaryWithoutPerformanceDeduction = salaryForPresentDays - (additionalComponents["professionalTax"] || 0);

//         // With Performance Allowance Deduction
//         const dailyNetSalary = netSalaryBeforeDeductions / 30;
//         const finalSalaryWithPerformanceDeduction = dailyNetSalary * (additionalComponents["presentDays"] || 0) - (additionalComponents["professionalTax"] || 0);

//         // Save to database
//         const payroll = new PayRoll({
//             ...payRollDetails,
//             // performanceAllowance,
//             grossSalary: ctc,
//             otherAllowance: allowance,
//             netSalary: netSalaryBeforeDeductions
//         });

//         await payroll.save();

//         return res.status(201).json({ message: "Payroll created successfully", payroll });

//     } catch (err) {

//         return res.status(500).json({ message: "Internal server error", error: err.message });
//     }
// };



// export let createPayRoll = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const payRollDetails: PayRollDocument = req.body;
//             const createData = new PayRoll(payRollDetails);
//             let insertData = await createData.save();
//             response(req, res, activity, 'Level-2', 'Create-PayRoll', true, 200, insertData, clientError.success.savedSuccessfully);
//         } catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Create-PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     } else {
//         response(req, res, activity, 'Level-3', 'Create-PayRoll', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// };



export let createPayRoll = async (req, res, next) => {
    console.log("balan")
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const payRollDetails: PayRollDocument = req.body;
            // const payRollDetails: PayRollDocument = req.body;

            // Ensure allowance and deduction are arrays, even if they're empty
            const allowanceComponents = payRollDetails.allowance || [];
            const deductionComponents = payRollDetails.deduction || [];

            console.log("99", payRollDetails.allowance)

            // Calculate total allowance
         
            let totalAllowance = 0;
            allowanceComponents.forEach(component => {
             console.log("hhhh", component)
                totalAllowance += component.amount;
            });

        
            // Calculate total deduction
            let totalDeduct = payRollDetails.taxDeduction || 0;
            deductionComponents.forEach(component => {
                console.log("kkkk", component)
                totalDeduct += component.amount;
            });

          

            // Calculate gross salary
            const ctc = payRollDetails.houseRent + payRollDetails.conveyance + totalAllowance;
            payRollDetails.grossSalary = ctc;

            // Performance Allowance: 10% of Gross Salary
            const performanceAllowance = payRollDetails.grossSalary * 0.1;

            // Add PF deduction to the total deduction
            totalDeduct += payRollDetails.pf || 0;

            // Calculate net salary
            payRollDetails.totalDeduction = totalDeduct;
            const netSalaryWithDeductions = payRollDetails.grossSalary - totalDeduct;

            // Calculate daily gross and net salary
            const dailyGrossSalary = payRollDetails.grossSalary / 30;
            // const salaryForPresentDays = dailyGrossSalary * (payRollDetails.presentDays || 0);

            const dailyNetSalary = netSalaryWithDeductions / 30;
            // const finalSalaryWithPerformanceDeduction = dailyNetSalary * (payRollDetails.presentDays || 0) - (payRollDetails.professionalTax || 0);

            // Save to database
            const payroll = new PayRoll({
                ...payRollDetails,
                otherAllowance: totalAllowance,
                netSalary: netSalaryWithDeductions
            });

            await payroll.save();
            res.status(200).json({
                message: "Payroll created successfully",
                payroll
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal server error",
                error: err.message
            });
        }
    } else {
        res.status(422).json({
            message: "Field validation error",
            errors: errors.mapped()
        });
    }
};

