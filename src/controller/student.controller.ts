import { Student, StudentDocument } from '../model/student.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt } from "../helper/Encryption";

var activity = "Student";



export let getAllStudent = async (req, res, next) => {
    try {
        const data = await Student.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Student', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Student', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleStudent = async (req, res, next) => {
    try {
        const student = await Student.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Student', true, 200, student, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Student', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

export let saveStudent = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const student = await Student.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!student) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)
                const studentDetails: StudentDocument = req.body;
                const uniqueId = Math.floor(Math.random() * 10000);
                studentDetails.studentCode = studentDetails.name + "_"+ uniqueId;
                const createData = new Student(studentDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'student'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'student';
                finalResult["studentDetails"] = result;
                
                response(req, res, activity, 'Level-2', 'Save-Student', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Student', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
          console.log(err)
            response(req, res, activity, 'Level-3', 'Save-Student', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Save-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateStudent = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const studentDetails : StudentDocument = req.body;
            const updateData = await Student.findOneAndUpdate({ _id: req.body._id }, {
                $set: {  
                    name: studentDetails.name,
                    passportNo: studentDetails.passportNo,
                    expiryDate:studentDetails.expiryDate,
                    dob: studentDetails.dob,
                    citizenship:studentDetails.citizenship,
                    gender:studentDetails.gender,
                    whatsAppNumber: studentDetails.whatsAppNumber,
                    degreeName:studentDetails.degreeName,
                    academicYear: studentDetails.academicYear,
                    institution:studentDetails.institution,
                    percentage: studentDetails.percentage,
                    doHaveAnyEnglishLanguageTest:studentDetails.doHaveAnyEnglishLanguageTest,
                    englishTestType:studentDetails.englishTestType,
                    testScore: studentDetails.testScore,
                    dateOfTest: studentDetails.dateOfTest,
                    country:studentDetails.country,
                    desiredUniversity:studentDetails.desiredUniversity, 
                    desiredCourse: studentDetails.desiredCourse, 
                    workExperience: studentDetails.workExperience,
                    anyVisaRejections: studentDetails.anyVisaRejections, 
                    visaReason:studentDetails.visaReason,
                    doYouHaveTravelHistory: studentDetails.doYouHaveTravelHistory, 
                    travelReason:studentDetails.travelReason,
                    finance: studentDetails.finance,
                    twitter:studentDetails .twitter,
                    facebook: studentDetails.facebook,
                    instagram: studentDetails.instagram,
                    linkedIn: studentDetails.linkedIn,

                    modifiedOn: studentDetails.modifiedOn,
                    modifiedBy:  studentDetails.modifiedBy,
                }
                
            });
            response(req, res, activity, 'Level-2', 'Update-Student', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Student', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Student', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let deleteStudent = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const student = await Student.findByIdAndDelete({ _id: id })
      
        response(req, res, activity, 'Level-2', 'Delete-Student', true, 200, student, 'Successfully Remove User');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Student', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredStudentBySuperAdmin = async (req, res, next) => {
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
        if (req.body.superAdminId) {
            andList.push({ superAdminId: req.body.superAdminId })
        }
      
       
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const studentList = await Student.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('studentId', { StudentName: 1, email: 1, mobileNumber: 1 })

        const studentCount = await Student.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter', true, 200, { studentList, studentCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

