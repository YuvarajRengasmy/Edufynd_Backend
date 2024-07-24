"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controller/admin.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, admin_controller_1.getAllAdmin);
router.get('/getSingleAdmin', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), admin_controller_1.getSingleAdmin);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), admin_controller_1.createAdmin);
router.delete('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), admin_controller_1.deleteAdmin);
router.put('/getFilterAdmin', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, admin_controller_1.getFilteredAdmin);
/// Super Admin can create and edit the admin profile
router.post('/createAdminBySuperAdmin', //create admin by super Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
admin_controller_1.createAdminBySuperAdmin);
router.put('/editAdminBySuperAdmin', //Update admin by super Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, admin_controller_1.editAdminProfileBySuperAdmin);
/// Admin can create and edit the student profile
router.post('/createStudentByAdmin', //create student by Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
admin_controller_1.createStudentByAdmin);
router.put('/editStudentByAdmin', //Update student by Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, admin_controller_1.editStudentProfileByAdmin);
/// Admin can create and edit the staff profile
router.post('/createStaffByAdmin', //create staff by  Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
admin_controller_1.createStaffByAdmin);
router.put('/editStaffByAdmin', //Update staff by Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, admin_controller_1.editStaffProfileByAdmin);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map