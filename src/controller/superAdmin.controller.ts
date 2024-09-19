import { SuperAdmin, SuperAdminDocument } from '../model/superAdmin.model'
import { University,} from '../model/university.model'
import { Program} from '../model/program.model'
import { Client, ClientDocument } from '../model/client.model'
import { Blog, BlogDocument } from '../blogs/blogs.model'
import { Commission, CommissionDocument } from '../model/commission.model'
import { Student, StudentDocument } from '../model/student.model'
import { Staff, StaffDocument } from '../model/staff.model'
import { Agent, AgentDocument } from '../model/agent.model'


import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt } from "../helper/Encryption";
import { normalizeUnits } from 'moment'

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

var activity = "SuperAdmin";




export let getSuperAdminForSearch = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let search = req.query.search
            const universityList = await University.find({ $and: [{ $or: [{ universityName: { $regex: search, $options: 'i' } }, { country: { $regex: search, $options: 'i' } }] }, { isDeleted: false }] }).populate('popularCategories',{popularCategories:1})
            const programList = await Program.find({ $and: [{ $or: [{ programTitle: { $regex: search, $options: 'i' } }, { universityName: { $regex: search, $options: 'i' } }] }, { isDeleted: false }] }).populate('country', { country: 1 })
            const clientList = await Client.find({ $and: [{ $or: [{typeOfClient: { $regex: search, $options: 'i' } }, { businessName: { $regex: search, $options: 'i' } }] }, { isDeleted: false }] }).populate('name', { name: 1, image: 1 })
            const blogList = await Blog.find({ $and: [{ $or: [{title: { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }] }, { isDeleted: false }] }).populate('title', { title: 1 })
            const commissionList = await Commission.find({ $and: [{ $or: [{ universityName: { $regex: search, $options: 'i' } }, { country: { $regex: search, $options: 'i' } }, { paymentType: { $regex: search, $options: 'i' } }] }, { isDeleted: false }] }).populate('universityName', { universityName: 1 })
            const studentList = await Student.find({ $and: [{ $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, ] }, { isDeleted: false }] }).populate('name', { name: 1 })
            const staffList = await Staff.find({ $and: [{ $or: [{ empName: { $regex: search, $options: 'i' } }, { designation: { $regex: search, $options: 'i' } },{ reportingManager: { $regex: search, $options: 'i' } } ] }, { isDeleted: false }] }).populate('empName', { empName: 1 })
            const agentList = await Agent.find({ $and: [{ $or: [{ agentName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, ] }, { isDeleted: false }] }).populate('agentName', { agentName: 1 })

            response(req, res, activity, 'Level-1', 'Get-SuperAdminForSeach', true, 200,
                 { commissionList,universityList, programList, clientList , blogList,studentList,staffList,agentList},
                 clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Get-SuperAdminForSeach', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Get-SuperAdminForSeach', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const getAllSuperAdmin = async (req, res) => {
    try {
        const data = await SuperAdmin.find({ isDeleted: false }).sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-SuperAdmin', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-SuperAdmin', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

export const getSingleSuperAdmin = async (req, res) => {
    try {
        const data = await SuperAdmin.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-SuperAdmin', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-SuperAdmin', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createSuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const admin = await SuperAdmin.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!admin) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)

                const superAdminDetails: SuperAdminDocument = req.body;
                const createData = new SuperAdmin(superAdminDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'SuperAdmin'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'SuperAdmin';
                finalResult["superAdminDetails"] = result;

                response(req, res, activity, 'Level-2', 'Create-Super-Admin', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Create-Super-Admin', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {

            response(req, res, activity, 'Level-3', 'Create-Super-Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Create-Super-Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let getFilteredSuperAdmin = async (req, res, next) => {
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
        if (req.body.adminId) {
            andList.push({ adminId: req.body.adminId })
        }
        if (req.body.staffId) {
            andList.push({ staffId: req.body.staffId })
        }
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const superAdminList = await SuperAdmin.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const superAdminCount = await SuperAdmin.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterSuperAdmin', true, 200, { superAdminList, superAdminCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterSuperAdmin', false, 500, {}, errorMessage.internalServer, err.message);
    }
};













