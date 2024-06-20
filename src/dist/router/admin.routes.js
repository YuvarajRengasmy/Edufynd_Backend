"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controller/admin.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.get('/', //get all admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, admin_controller_1.getAllAdmin);
router.get('/getSingleAdmin', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), admin_controller_1.getSingleAdmin);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), admin_controller_1.createAdmin);
router.put('/', //create student by Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
admin_controller_1.createStudentByAdmin);
router.put('/createStaff', //create staff by  Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
admin_controller_1.createStaffByAdmin);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map