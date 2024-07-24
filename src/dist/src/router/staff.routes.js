"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staff_controller_1 = require("../controller/staff.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const fileUploaded_1 = require("../utils/fileUploaded");
const router = (0, express_1.Router)();
router.get('/', //get all staff Details
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, staff_controller_1.getAllStaff);
router.get('/getSingleStaff', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), staff_controller_1.getSingleStaff);
router.post('/', // create staff
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, staff_controller_1.createStaff);
router.put('/', // update Staff Details
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
(0, Validators_1.checkRequestBodyParams)('_id'), staff_controller_1.updateStaff);
router.delete('/', //delete staff
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), staff_controller_1.deleteStaff);
router.post('/createStaffBySuperAdmin', //create staff by super Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
staff_controller_1.createStaffBySuperAdmin);
router.put('/getFilterStaffSuperAdmin', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, staff_controller_1.getFilteredStaff);
router.post('/import', // CSV File to json and Store into Database
fileUploaded_1.default.single('file'), staff_controller_1.csvToJson);
exports.default = router;
//# sourceMappingURL=staff.routes.js.map