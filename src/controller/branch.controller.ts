import { Branch, BranchDocument } from '../model/branch.model'
import { Logs } from "../model/logs.model";
import { Staff, StaffDocument } from '../model/staff.model'
import { Student, StudentDocument } from '../model/student.model'
import { SuperAdmin } from '../model/superAdmin.model'
import { Agent } from '../model/agent.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt, generateRandomPassword } from "../helper/Encryption";
import * as config from '../config';

var activity = "Branch";



export let getAllBranch = async (req, res, next) => {
    try {
        const data = await Branch.find({ isDeleted: false }).sort({ branchCode: -1 });
        response(req, res, activity, 'Level-1', 'GetAll-Branch', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Branch', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getAllLoggedBranch = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Branch" })
        response(req, res, activity, 'Level-1', 'All-Logged Branch', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Branch', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getSingleLoggedBranch = async (req, res) => {
    try {
      const { _id } = req.query;
  
      // Fetch logs by documentId
      const logs = await Logs.find({ documentId: _id });
  
      // If no logs are found, return a 404 response and stop further execution
      if (!logs || logs.length === 0) {
        return res.status(404).json({ message: "No logs found for this Branch." });
      }
  
      // If logs are found, return them with a 200 response
      return response(req, res, activity, 'Level-1', 'Single-Logged Branch', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      // In case of an error, return a 500 response and stop further execution
      return response(req, res, activity, 'Level-2', 'Single-Logged Branch', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };
  


  
export let getSingleBranch = async (req, res, next) => {
    try {
        const agent = await Branch.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Branch', true, 200, agent, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Single-Branch', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


const generateNextBranchCode = async (): Promise<string> => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const admin = await Branch.find({}, 'adminCode').exec();

    const maxCounter = admin.reduce((max, app) => {

        const appCode = app.adminCode;

        const parts = appCode.split('_')
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10)
            return counter > max ? counter : max;
        }
        return max;
    }, 100);

    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `AD_${formattedCounter}`;
};

export let createBranch = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const admin = await Branch.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!admin) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)

                const branchDetails: BranchDocument = req.body;
                branchDetails.adminCode = await generateNextBranchCode();
                const createData = new Branch(branchDetails);
                let insertData = await createData.save();
            
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'admin'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'admin';
                finalResult["adminDetails"] = result;
                response(req, res, activity, 'Level-1', 'Create-Branch', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-2', 'Create-Branch', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
console.log(err)
            response(req, res, activity, 'Level-3', 'Create-Branch', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Create-Branch', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export const updateBranch = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const branchDetails: BranchDocument = req.body;
            let statusData = await Branch.findByIdAndUpdate({ _id: branchDetails._id }, {
                $set: {
                    name: branchDetails.name,
                    email: branchDetails.email,
                    dial: branchDetails.dial,
                    mobileNumber: branchDetails.mobileNumber,
                    role: branchDetails.role,
                    privileges: branchDetails.privileges, 
                    dial1: branchDetails.dial1,
                    modifiedOn: new Date(),
                  
                }
            });

            response(req, res, activity, 'Level-1', 'Update-Branch Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-Branch Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Demo Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let deleteBranch = async (req, res, next) => {

    try {
        const branch = await Branch.findOneAndDelete({ _id: req.query._id })

        response(req, res, activity, 'Level-1', 'Delete-Branch', true, 200, branch, 'Successfully Remove the Branch');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-2', 'Delete-Branch', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredBranch = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        // andList.push({ status: 1 })
        if (req.body.studentId) {
            andList.push({ studentId: req.body.studentId })
        }
        if (req.body.agentId) {
            andList.push({ agentId: req.body.agentId })
        }
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId })
        }
        if (req.body.programId) {
            andList.push({ programId: req.body.programId })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const branchList = await Branch.find(findQuery).sort({ adminCode: -1 }).limit(limit).skip(page)

        const branchCount = await Branch.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter-Branch', true, 200, { branchList, branchCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Filter-Branch', false, 500, {}, errorMessage.internalServer, err.message);
    }
};





export let activeBranch = async (req, res, next) => {
    try {
        const branchIds = req.body.branchIds; 

        const branch = await Branch.updateMany(
            { _id: { $in: branchIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );

        if (branch.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-Branch', true, 200, branch, 'Successfully Activated Branch.');
        } else {
            response(req, res, activity, 'Level-3', 'Active-Branch', false, 400, {}, 'Already Branch were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-Branch', false, 500, {}, 'Internal Server Error', err.message);
    }
};


export let deactivateBranch = async (req, res, next) => {
    try {
        const branchIds = req.body.branchIds; 
      const branch = await Branch.updateMany(
        { _id: { $in: branchIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (branch.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-Branch', true, 200, branch, 'Successfully deactivated Branch.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-Branch', false, 400, {}, 'Already Branch were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-Branch', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  


export let assignStaffId = async (req, res, next) => {
    try {
        const { Ids, staffId,staffName } = req.body;  


        const user = await Branch.updateMany(
            { _id: { $in: Ids } }, 
            { $set: { staffId: staffId , staffName:staffName } }, 
            { new: true }
        );

        if (user.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Assign staff', true, 200, user, 'Successfully assigned staff');
        } else {
            response(req, res, activity, 'Level-3', 'Assign staff', false, 400, {}, 'No staff were assigned.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Assign staff', false, 500, {}, 'Internal Server Error', err.message);
    }
};