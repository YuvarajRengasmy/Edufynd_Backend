"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const university_controller_1 = require("../controller/university.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const fileUploaded_1 = require("../utils/fileUploaded");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, university_controller_1.getAllUniversity);
router.get('/getSingleUniversity', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), university_controller_1.getSingleUniversity);
router.post('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, university_controller_1.saveUniversity);
router.put('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
(0, Validators_1.checkRequestBodyParams)('_id'), university_controller_1.updateUniversity);
router.delete('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), university_controller_1.deleteUniversity);
router.put('/getFilterUniversity', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, university_controller_1.getFilteredUniversity);
router.get('/getAllUniversityForWeb', // get all university for web //without checking session
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, university_controller_1.getAllUniversityForWeb);
router.put('/agentFilterUniversity', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, university_controller_1.getFilteredUniversityForAgent);
router.put('/studentFilterUniversity', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, university_controller_1.getFilteredUniversityForStudent);
router.post('/import', // CSV File to json and Store into Database
fileUploaded_1.default.single('file'), university_controller_1.csvToJson);
////////
router.get('/getProgramByUniversity', /// Get university details with that university program          
(0, Validators_1.checkQuery)('universityId'), university_controller_1.getUniversityWithProgramDetails);
router.get('/getUniversityByCountry', checkAuth_1.basicAuthUser, university_controller_1.getUniversityByCountry);
router.get('/getUniversityByName', checkAuth_1.basicAuthUser, university_controller_1.getUniversityByName);
exports.default = router;
//# sourceMappingURL=university.routes.js.map