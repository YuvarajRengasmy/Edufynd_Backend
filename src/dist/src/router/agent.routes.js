"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agent_controller_1 = require("../controller/agent.controller");
const contact_controller_1 = require("../controller/contact.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const fileUploaded_1 = require("../utils/fileUploaded");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, agent_controller_1.getAllAgent);
router.get('/getSingleAgent', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), agent_controller_1.getSingleAgent);
router.post('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), agent_controller_1.createAgent);
router.post('/contact', contact_controller_1.createContact);
router.put('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), agent_controller_1.updateAgent);
router.delete('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), agent_controller_1.deleteAgent);
router.post('/createAgentBySuperAdmin', //create agent by super Admin
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
agent_controller_1.createAgentBySuperAdmin);
router.put('/getFilterStudentByAgent', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, agent_controller_1.getFilteredStudentByAgent);
router.get('/viewStudentByAgent', //View student by agent
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// validateAgentId,
(0, Validators_1.checkQuery)('studentId'), agent_controller_1.viewStudentProfileByAgent);
router.post('/createStudentByAgent', //create student by agent
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// validateAgentId,
agent_controller_1.createStudentProfileByAgent);
router.put('/updateStudentByAgent', //Update student by agent
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// validateAgentId,
agent_controller_1.editStudentProfileByAgent);
router.delete('/deleteStudentByAgent', //Delete student by agent
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// validateAgentId,
agent_controller_1.deleteStudentByAgent);
router.post('/import', // CSV File to json and Store into Database
fileUploaded_1.default.single('file'), agent_controller_1.csvToJson);
exports.default = router;
//# sourceMappingURL=agent.routes.js.map