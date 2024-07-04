import { Admin, AdminDocument } from '../model/admin.model'
import { SuperAdmin, SuperAdminDocument } from '../model/superAdmin.model'
import { Staff, StaffDocument } from '../model/staff.model'
import { Student, StudentDocument } from '../model/student.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt } from "../helper/Encryption";

var activity = "Admin";



export let getAllAdmin = async (req, res, next) => {
    try {
        const data = await Admin.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Admin', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleAdmin = async (req, res, next) => {
    try {
        const agent = await Admin.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Admin', true, 200, agent, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


const generateNextAdminCode = async (): Promise<string> => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const admin = await Admin.find({}, 'adminCode').exec();

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

export let createAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const admin = await Admin.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!admin) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)

                const adminDetails: AdminDocument = req.body;
                adminDetails.adminCode = await generateNextAdminCode();

                const createData = new Admin(adminDetails);
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

                response(req, res, activity, 'Level-2', 'Create-Admin', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Create-Admin', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {

            response(req, res, activity, 'Level-3', 'Create-Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Create-Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


// export let updateAdmin = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const adminDetails: AdminDocument = req.body;
//             const updateData = await Admin.findOneAndUpdate({ _id: adminDetails._id }, {
//                 $set: {

//                     businessName: agentDetails.businessName,
//                     whatsAppNumber: agentDetails.whatsAppNumber,
//                     bankDetail: agentDetails.bankDetail,
//                     panNumberIndividual: agentDetails.panNumberIndividual,
//                     panNumberCompany: agentDetails.panNumberCompany,
//                     gstn: agentDetails.gstn,
//                     inc: agentDetails.inc,
//                     agentsCommission: agentDetails.agentsCommission,
//                     agentBusinessLogo: agentDetails.agentBusinessLogo,
//                     countryInterested: agentDetails.countryInterested,
//                     privileges: agentDetails.privileges,
//                     addressLine1: agentDetails.addressLine1,
//                     addressLine2: agentDetails.addressLine2,
//                     addressLine3: agentDetails.addressLine3,
//                     staffName: agentDetails.staffName,
//                     staffContactNo: agentDetails.staffContactNo,


//                     modifiedOn: agentDetails.modifiedOn,
//                     modifiedBy: agentDetails.modifiedBy,
//                 }


//             });
//             response(req, res, activity, 'Level-2', 'Update-Agent', true, 200, updateData, clientError.success.updateSuccess);
//         }
//         catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Update-Agent', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Update-Agent', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }


export let deleteAdmin = async (req, res, next) => {

    try {
        const agent = await Admin.findOneAndDelete({ _id: req.query._id })

        response(req, res, activity, 'Level-2', 'Delete-Admin', true, 200, agent, 'Successfully Admin University');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredAdmin = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
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

        const adminList = await Admin.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const adminCount = await Admin.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterAdmin', true, 200, { adminList, adminCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterAdmin', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let createAdminBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const adminDetails: AdminDocument = req.body;

            adminDetails.adminCode = await generateNextAdminCode();
            req.body.password = await encrypt(req.body.password)
            req.body.confirmPassword = await encrypt(req.body.confirmPassword)
            const createAdmin = new Admin(adminDetails);
            const insertAdmin = await createAdmin.save();

            const newHash = await decrypt(insertAdmin["password"]);

            const mailOptions = {
                from: 'balan9133civil@gmail.com',
                to: insertAdmin.email,
                subject: 'Welcome to EduFynd',
                text: `Hello ${insertAdmin.name},\n\nYour account has been created successfully.\n\nYour login credentials are:\nUsername: ${insertAdmin.email}\nPassword: ${newHash}\n\nPlease change your password after logging in for the first time.\n\n Best regards\nAfynd Private Limited\nChennai.`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(201).json({ message: 'Admin profile created and email sent login credentials', admin: insertAdmin });
                }
            });
            response(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', true, 200, { admin: insertAdmin }, 'Admin created successfully by SuperAdmin.');

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};


export const editAdminProfileBySuperAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const adminDetails: AdminDocument = req.body;
            const updateData = await Admin.findOneAndUpdate({ _id: adminDetails._id }, {
                $set: {
                    role: adminDetails.role,
                    modifiedOn: adminDetails.modifiedOn,
                    modifiedBy: adminDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Admin by Super Admin', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Admin by Super Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Admin by Super Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let createStudentByAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const adminDetails: AdminDocument = req.body;
            const studentDetails: StudentDocument = req.body;

            // Admin exist, proceed to create a new student
            const createStudent = new Student(studentDetails);

            // Save the student to the database
            const insertStudent = await createStudent.save();

            // Respond with success message
            response(req, res, activity, 'Level-3', 'Create-Student-By-Admin', true, 200, { student: insertStudent }, 'Student created successfully by Admin.');

        } catch (err: any) {
            // Handle server error
            response(req, res, activity, 'Level-3', 'Create-Student-By-Admin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        // Request body validation failed, respond with error message
        response(req, res, activity, 'Level-3', 'Create-Student-By-Admin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};



export const editStudentProfileByAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const studentDetails: StudentDocument = req.body;
            const updateData = await Student.findOneAndUpdate({ _id: studentDetails._id }, {
                $set: {
                    name: studentDetails.name,
                    passportNo: studentDetails.passportNo,
                    expiryDate: studentDetails.expiryDate,
                    dob: studentDetails.dob,
                    citizenship: studentDetails.citizenship,
                    gender: studentDetails.gender,
                    whatsAppNumber: studentDetails.whatsAppNumber,
                    degreeName: studentDetails.degreeName,
                    academicYear: studentDetails.academicYear,
                    institution: studentDetails.institution,
                    percentage: studentDetails.percentage,
                    doHaveAnyEnglishLanguageTest: studentDetails.doHaveAnyEnglishLanguageTest,
                    englishTestType: studentDetails.englishTestType,
                    testScore: studentDetails.testScore,
                    dateOfTest: studentDetails.dateOfTest,
                    country: studentDetails.country,
                    desiredUniversity: studentDetails.desiredUniversity,
                    desiredCourse: studentDetails.desiredCourse,
                    workExperience: studentDetails.workExperience,
                    anyVisaRejections: studentDetails.anyVisaRejections,
                    visaReason: studentDetails.visaReason,
                    doYouHaveTravelHistory: studentDetails.doYouHaveTravelHistory,
                    travelReason: studentDetails.travelReason,
                    finance: studentDetails.finance,
                    twitter: studentDetails.twitter,
                    facebook: studentDetails.facebook,
                    instagram: studentDetails.instagram,
                    linkedIn: studentDetails.linkedIn,
                    photo: studentDetails.photo,
                    resume: studentDetails.resume,
                    passport: studentDetails.passport,
                    sslc: studentDetails.sslc,
                    hsc: studentDetails.hsc,
                    degree: studentDetails.degree,
                    additional: studentDetails.additional,

                    modifiedOn: studentDetails.modifiedOn,
                    modifiedBy: studentDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Student by Admin', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Student by Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Student by Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



export let createStaffByAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const adminDetails: AdminDocument = req.body;
            const staffDetails: StaffDocument = req.body;

            // Admin exist, proceed to create a new staff
            const createstaff = new Staff(staffDetails);

            // Save the staff to the database
            const insertStaff = await createstaff.save();

            // Respond with success message
            response(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', true, 200, { staff: insertStaff }, 'Staff created successfully by Admin.');

        } catch (err: any) {
            // Handle server error
            response(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        // Request body validation failed, respond with error message
        response(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};


export const editStaffProfileByAdmin = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const staffDetails: StaffDocument = req.body;
            let staffData = await Staff.findByIdAndUpdate({ _id: staffDetails._id }, {
                $set: {
                    photo:staffDetails.photo,
                    empName: staffDetails.empName,
                    designation:staffDetails.designation,
                    jobDescription: staffDetails.jobDescription,
                    reportingManager:staffDetails.reportingManager,
                    shiftTiming:staffDetails.shiftTiming,                    
                    areTheyEligibleForCasualLeave: staffDetails.areTheyEligibleForCasualLeave,                
                    address:staffDetails.address,
                    emergencyContactNo:staffDetails.emergencyContactNo,
                    probationDuration: staffDetails.probationDuration,
                    salary: staffDetails.salary,              
                    privileges:staffDetails.privileges,               
                    idCard: staffDetails.idCard,                  
                    manageApplications:staffDetails.manageApplications,         
                    activeInactive: staffDetails.activeInactive,             
                    teamLead: staffDetails.teamLead,
                    status:  staffDetails.status,
                    modifiedOn: staffDetails.modifiedOn,
                    modifiedBy:  staffDetails.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-Staff by Admin', true, 200, staffData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Staff by Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Staff by Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

