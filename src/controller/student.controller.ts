import { Student, StudentDocument } from '../model/student.model'
import { SuperAdmin, SuperAdminDocument } from '../model/superAdmin.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt, generateRandomPassword } from "../helper/Encryption";
import csv = require("csvtojson")

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
        const newHash = await decrypt(student["password"]);
        const newHash1 = await decrypt(student["confirmPassword"]);

        response(req, res, activity, 'Level-1', 'Get-Single-Student', true, 200, { ...student.toObject(), password: newHash, confirmPassword: newHash1 }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
      
        response(req, res, activity, 'Level-3', 'Get-Single-Student', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


// const generateNextStudentCode = async (): Promise<string> => {
//     // Retrieve all applicant IDs to determine the highest existing applicant counter
//     const student = await Student.find({}, 'studentCode').exec();

//     const maxCounter = student.reduce((max, app) => {
//         const appCode = app.studentCode;
//         const parts = appCode.split('_')
//         if (parts.length === 2) {
//             const counter = parseInt(parts[1], 10)
//             return counter > max ? counter : max;
//         }
//         return max;
//     }, 100);

//     // Increment the counter
//     const newCounter = maxCounter + 1;
//     // Format the counter as a string with leading zeros
//     const formattedCounter = String(newCounter).padStart(3, '0');
//     // Return the new Applicantion Code
//     return `ST_${formattedCounter}`;
// };

const generateNextStudentCode = async (currentMaxCounter): Promise<string> => {
    // Increment the counter
    const newCounter = currentMaxCounter + 1;

    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');

    // Return the new client ID
    return `ST_${formattedCounter}`;
};


export let saveStudent = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const student = await Student.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!student) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)
                const studentDetails: StudentDocument = req.body;
                studentDetails.createdOn = new Date();

                const student = await Student.find({}, 'studentCode').exec();
                const maxCounter = student.reduce((max, app) => {
                    const appCode = app.studentCode;
                    const parts = appCode.split('_')
                    if (parts.length === 2) {
                        const counter = parseInt(parts[1], 10)
                        return counter > max ? counter : max;
                    }
                    return max;
                }, 100);
                let currentMaxCounter = maxCounter;
                studentDetails.studentCode = await generateNextStudentCode(currentMaxCounter);
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
        response(req, res, activity, 'Level-3', 'Save-Student', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let updateStudent = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const studentDetails: StudentDocument = req.body;

            // Handling file uploads
            if (req.files && req.files['photo']) {
                studentDetails.photo = `${req.protocol}://${req.get('host')}/uploads/${req.files['photo'][0].filename}`;
            }
            if (req.files && req.files['resume']) {
                studentDetails.resume = `${req.protocol}://${req.get('host')}/uploads/${req.files['resume'][0].filename}`;
            }
            if (req.files && req.files['passport']) {
                studentDetails.passport = `${req.protocol}://${req.get('host')}/uploads/${req.files['passport'][0].filename}`;
            }
            if (req.files && req.files['sslc']) {
                studentDetails.sslc = `${req.protocol}://${req.get('host')}/uploads/${req.files['sslc'][0].filename}`;
            }
            if (req.files && req.files['hsc']) {
                studentDetails.hsc = `${req.protocol}://${req.get('host')}/uploads/${req.files['hsc'][0].filename}`;
            }
            if (req.files && req.files['degree']) {
                studentDetails.degree = req.files['degree'].map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            }
            if (req.files && req.files['additional']) {
                studentDetails.additional = req.files['additional'].map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            }

            const updateFields = {
                name: studentDetails.name,
                passportNo: studentDetails.passportNo,
                expiryDate: studentDetails.expiryDate,
                dob: studentDetails.dob,
                citizenship: studentDetails.citizenship,
                gender: studentDetails.gender,
                whatsAppNumber: studentDetails.whatsAppNumber,
                primaryNumber: studentDetails.primaryNumber,
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

                duration: studentDetails.duration,
                lastEmployeer: studentDetails.lastEmployeer,
                lastDesignation: studentDetails.lastDesignation,
                date: studentDetails.date,
                purpose: studentDetails.purpose,
                countryName: studentDetails.countryName,
                modifiedOn: new Date(),
                modifiedBy: studentDetails.modifiedBy,
            };

            // Conditionally add file fields to updateFields
            if (studentDetails.photo) updateFields.photo = studentDetails.photo;
            if (studentDetails.resume) updateFields.resume = studentDetails.resume;
            if (studentDetails.passport) updateFields.passport = studentDetails.passport;
            if (studentDetails.sslc) updateFields.sslc = studentDetails.sslc;
            if (studentDetails.hsc) updateFields.hsc = studentDetails.hsc;
            if (studentDetails.degree) updateFields.degree = studentDetails.degree;
            if (studentDetails.additional) updateFields.additional = studentDetails.additional;

            const updateData = await Student.findOneAndUpdate({ _id: req.body._id }, { $set: updateFields }, { new: true });

            response(req, res, 'Update-Student', 'Level-2', 'Update-Student', true, 200, updateData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, 'Update-Student', 'Level-3', 'Update-Student', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, 'Update-Student', 'Level-3', 'Update-Student', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



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

export let getFilteredStudent = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.studentCode) {
            andList.push({ studentCode: req.body.studentCode })
        }
        if (req.body.name) {
            andList.push({ name: req.body.name })
        }
        if (req.body.passportNo) {
            andList.push({ passportNo: req.body.passportNo })
        }
        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const studentList = await Student.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const studentCount = await Student.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterStudent', true, 200, { studentList, studentCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterStudent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export const csvToJson = async (req, res) => {
    try {
      
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);

        const student = await Student.find({}, 'studentCode').exec();
                const maxCounter = student.reduce((max, app) => {
                    const appCode = app.studentCode;
                    const parts = appCode.split('_')
                    if (parts.length === 2) {
                        const counter = parseInt(parts[1], 10)
                        return counter > max ? counter : max;
                    }
                    return max;
                }, 100);
                let currentMaxCounter = maxCounter;

        // Process CSV data
        let studentList = [];
        for (const data of csvData) {
            const studentCode = await generateNextStudentCode(currentMaxCounter);
            currentMaxCounter++;
            studentList.push({
                studentCode: studentCode,
                name:data.Name,
                email: data.Email,
                mobileNumber: data.MobileNumber,
                whatsAppNumber: data.WhatsAppNumber,
                gender:data.GreGmatRequirementender,
                dob: data.DOB,
                source: data.Source,
                passportNo: data.PassportNo,
                expiryDate: data.ExpiryDate,
                citizenship:data.Citizenship,
                highestQualification: data.HighestQualification,
                degreeName: data.DegreeName,
                academicYear: data.AcademicYear,
                yearPassed: data.YearPassed,
                institution:data.Institution,
                percentage: data.Percentage,
                country: data.Country,
                desiredUniversity: data.DesiredUniversity,
                desiredCourse: data.DesiredCourse,
                doHaveAnyEnglishLanguageTest: data.DoHaveAnyEnglishLanguageTest,
                englishTestType:data.EnglishTestType,
                testScore: data.TestScore,
                dateOfTest: data.DateOfTest,
                workExperience: data.WorkExperience,
                anyVisaRejections: data.AnyVisaRejections,
                visaReason: data.VisaReason,
                doYouHaveTravelHistory: data.DoYouHaveTravelHistory,
                travelReason: data.TravelReason,
                finance: data.Finance,
                twitter: data.Twitter,
                instagram: data.Instagram,
                facebook: data.Facebook,
                linkedIn: data.LinkedIn,

            });
        }

        // Insert into the database
        await Student.insertMany(studentList);
        // Send success response
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for student module', true, 200, { studentList }, 'Successfully CSV File Store Into Database');
    } catch (err) {
        console.error(err);
        // Send error response
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for student module', false, 500, {}, 'Internal Server Error', err.message);
    }
};



export let createStudentBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {

            const studentDetails: StudentDocument = req.body;
            const student = await Student.find({}, 'studentCode').exec();
            const maxCounter = student.reduce((max, app) => {
                const appCode = app.studentCode;
                const parts = appCode.split('_')
                if (parts.length === 2) {
                    const counter = parseInt(parts[1], 10)
                    return counter > max ? counter : max;
                }
                return max;
            }, 100);
            let currentMaxCounter = maxCounter;
            studentDetails.studentCode = await generateNextStudentCode(currentMaxCounter);
            // Generate random passwords
            const password = generateRandomPassword(8);
            const confirmPassword = password; // Since password and confirmPassword should match
            studentDetails.password = await encrypt(password)
            studentDetails.confirmPassword = await encrypt(confirmPassword)
            const createStudent = new Student(studentDetails);
            const insertStudent = await createStudent.save();


            const newHash = await decrypt(insertStudent["password"]);

            const mailOptions = {
                from: 'balan9133civil@gmail.com',
                to: insertStudent.email,
                subject: 'Welcome to EduFynd',
                text: `Hello ${insertStudent.name},\n\nYour account has been created successfully.\n\nYour login credentials are:\nUsername: ${insertStudent.email}\nPassword: ${newHash}\n\nPlease change your password after logging in for the first time.\n\n Best regards\nAfynd Private Limited\nChennai.`
            };

            transporter.sendMail(mailOptions, (error, info) => {

                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(201).json({ message: 'Student profile created and email sent login credentials', student: insertStudent });
                }
            });
            response(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', true, 200, {
                student: insertStudent,


            }, 'Student created successfully by SuperAdmin.');

        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};


export const editStudentProfileBySuperAdmin = async (req, res) => {
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

                    duration: studentDetails.duration,
                    lastEmployeer: studentDetails.lastEmployeer,
                    lastDesignation: studentDetails.lastDesignation,
                    date: studentDetails.date,
                    purpose: studentDetails.purpose,
                    countryName: studentDetails.countryName,

                    modifiedOn: new Date(),
                    modifiedBy: studentDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Student by Super Admin', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Student by Super Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Student by Super Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

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

