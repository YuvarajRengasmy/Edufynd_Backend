"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentEnquiry_controller_1 = require("../controller/studentEnquiry.controller");
const Validators_1 = require("../../middleware/Validators");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, 
//  checkSession,
studentEnquiry_controller_1.getAllStudentEnquiry);
router.get('/getSingleStudentEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), studentEnquiry_controller_1.getSingleStudentEnquiry);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), studentEnquiry_controller_1.createStudentEnquiry);
router.put('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), studentEnquiry_controller_1.updateStudentEnquiry);
router.delete('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), studentEnquiry_controller_1.deleteStudentEnquiry);
router.put('/getFilterStudentEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
studentEnquiry_controller_1.getFilteredStudentEnquiry);
exports.default = router;
//# sourceMappingURL=studentEnquiry.route.js.map