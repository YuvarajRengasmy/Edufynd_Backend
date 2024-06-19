"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const program_controller_1 = require("../controller/program.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const fileUploaded_1 = require("../utils/fileUploaded");
const router = (0, express_1.Router)();
router.get('/', //get all program
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, program_controller_1.getAllProgram);
router.get('/getSingleProgram', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), program_controller_1.getSingleProgram);
router.post('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, program_controller_1.createProgram);
router.put('/', // update 
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
(0, Validators_1.checkRequestBodyParams)('_id'), program_controller_1.updateProgram);
router.delete('/', //delete program
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), program_controller_1.deleteProgram);
router.get('/getAllProgramForWeb', // get all program for web //without checking session
checkAuth_1.basicAuthUser, program_controller_1.getAllProgramForWeb);
router.put('/getUniversityFilterProgram', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, program_controller_1.getFilteredProgram);
router.put('/appliedStudent', // Filter for Applied Student of University
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, program_controller_1.getFilteredProgramForAppliedStudent);
router.post('/import', // CSV File to json and Store into Database
fileUploaded_1.default.single('program'), program_controller_1.csvToJson);
router.get('/getProgramByUniversity', /// Get university details with that university program          
(0, Validators_1.checkQuery)('universityId'), program_controller_1.getProgramsByUniversityName);
router.get('/programDetails', /// Get program details with that university program          
checkAuth_1.basicAuthUser, program_controller_1.getProgramDetailsByUniversity);
router.put('/applyStudent', checkAuth_1.basicAuthUser, program_controller_1.updateProgramApplications);
exports.default = router;
//# sourceMappingURL=program.routes.js.map