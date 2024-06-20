"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const superAdmin_controller_1 = require("../controller/superAdmin.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), superAdmin_controller_1.createSuperAdmin);
router.put('/createStudent', //create student by super Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
superAdmin_controller_1.createStudentBySuperAdmin);
router.put('/createAgent', //create agent by super Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
superAdmin_controller_1.createAgentBySuperAdmin);
router.put('/createAdmin', //create admin by super Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
superAdmin_controller_1.createAdminBySuperAdmin);
router.put('/createStaff', //create staff by super Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
superAdmin_controller_1.createStaffBySuperAdmin);
exports.default = router;
