"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = require("../controller/client.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const fileUploaded_1 = require("../utils/fileUploaded");
const router = (0, express_1.Router)();
router.get('/', //get all client
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, client_controller_1.getAllClient);
router.get('/getSingleClient', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), client_controller_1.getSingleClient);
router.post('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, client_controller_1.saveClient);
router.put('/', // update 
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, 
// checkQuery('_id'),
(0, Validators_1.checkRequestBodyParams)('_id'), client_controller_1.updateClient);
router.delete('/', //delete client
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), client_controller_1.deleteClient);
router.post('/import', // CSV File to json and Store into Database
fileUploaded_1.default.single('file'), client_controller_1.csvToJson);
exports.default = router;
//# sourceMappingURL=client.routes.js.map