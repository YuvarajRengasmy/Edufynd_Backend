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




export let createPayRoll = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const payRollDetails:PayRollDocument = req.body;
            const createData = new PayRoll(payRollDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-PayRoll', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-PayRoll', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updatePayRoll = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
          
            const payRollDetails:PayRollDocument = req.body;
            const updateData = await PayRoll.findOneAndUpdate({ _id: payRollDetails._id }, {
                $set: {  
                    houseRent: payRollDetails.houseRent,
                    conveyance: payRollDetails.conveyance,
                    otherAllowance: payRollDetails.otherAllowance,
                    pf: payRollDetails.pf,
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
    //         const { staffId, presentDays, grossSalary, performanceAllowanceDeduction, professionalTax } = req.body;
    
    //         // Basic Salary: 40% of Gross Salary
    //         const basicSalary = grossSalary * 0.4;
    
    //         // HRA: 40% of Basic Salary
    //         const hra = basicSalary * 0.4;
    
    //         // Other Allowances (fixed)
    //         const conveyance = 830;
    //         const transportAllowance = 1660;
    //         const leaveTravelAllowance = 1000;
    //         const medicalAllowance = 1250;
    //         const specialAllowance = 1380;
    
    //         // Performance Allowance: 10% of Gross Salary
    //         const performanceAllowance = grossSalary * 0.1;
    
    //         // Deductions
    //         const pf = 900; // Example PF
    //         const esi = 400; // Example ESI / Health Insurance
    //         const totalDeduction = performanceAllowance + professionalTax + pf + esi;
    
    //         // Net Salary before deductions
    //         const netSalaryBeforeDeductions = grossSalary - totalDeduction;
    
    //         // Salary Calculation Based on Attendance
    //         const dailyGrossSalary = grossSalary / 30;
    //         const salaryForPresentDays = dailyGrossSalary * presentDays;
    
    //         const finalSalaryWithoutPerformanceDeduction = salaryForPresentDays - professionalTax;
    
    //         // With Performance Allowance Deduction
    //         const dailyNetSalary = netSalaryBeforeDeductions / 30;
    //         const finalSalaryWithPerformanceDeduction = dailyNetSalary * presentDays - professionalTax;
    
    //         // Response Example
    //         const salaryDetails = {
    //             basicSalary,
    //             hra,
    //             conveyance,
    //             transportAllowance,
    //             leaveTravelAllowance,
    //             medicalAllowance,
    //             specialAllowance,
    //             performanceAllowance,
    //             pf,
    //             esi,
    //             totalDeduction,
    //             netSalaryBeforeDeductions,
    //             finalSalaryWithoutPerformanceDeduction,
    //             finalSalaryWithPerformanceDeduction
    //         };
    
    //         return res.status(200).json({
    //             message: "Salary calculated successfully",
    //             salaryDetails
    //         });
    
    //     } catch (err) {
    //         return res.status(500).json({ message: "Internal server error", error: err.message });
    //     }
    // };




    export const calculateSalary = async (req, res) => {
        try {
            const payRollDetails:PayRollDocument = req.body;
    
            // Performance Allowance: 10% of Gross Salary
            const performanceAllowance = payRollDetails.grossSalary * 0.1;
    
            // Deductions
            const totalDeduction = performanceAllowance + 
                                   (payRollDetails.additionalComponents.get("professionalTax") || 0) + 
                                   (payRollDetails.pf || 0) + 
                                   (payRollDetails.additionalComponents.get("esi") || 0);
    
            // Net Salary before deductions
            const netSalaryBeforeDeductions = payRollDetails.grossSalary - totalDeduction;
    
            // Salary Calculation Based on Attendance
            const dailyGrossSalary = payRollDetails.grossSalary / 30;
            const salaryForPresentDays = dailyGrossSalary * (payRollDetails.additionalComponents.get("presentDays") || 0);
    
            const finalSalaryWithoutPerformanceDeduction = salaryForPresentDays - (payRollDetails.additionalComponents.get("professionalTax") || 0);
    
            // With Performance Allowance Deduction
            const dailyNetSalary = netSalaryBeforeDeductions / 30;
            const finalSalaryWithPerformanceDeduction = dailyNetSalary * (payRollDetails.additionalComponents.get("presentDays") || 0) - (payRollDetails.additionalComponents.get("professionalTax") || 0);
    
            // Save to database
            const payroll = new PayRoll({
                ...payRollDetails,
                performanceAllowance,
                totalDeduction,
                netSalary: finalSalaryWithPerformanceDeduction
            });
    
            await payroll.save();
    
            return res.status(201).json({ message: "Payroll salary created successfully", payroll });
    
        } catch (err) {
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }
    };
    
    

    export const createPayrolll = async (req, res) => {
        try {
           
            const payRollDetails:PayRollDocument = req.body;
       
            // Save to database
            const payroll = new PayRoll(payRollDetails);
            await payroll.save();
    
            return res.status(201).json({ message: "Payroll created successfully", payroll });
        } catch (err) {
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }
    };
    