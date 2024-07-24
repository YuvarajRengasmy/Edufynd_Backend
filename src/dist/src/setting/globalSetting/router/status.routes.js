"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const status_controller_1 = require("../../globalSetting/controller/status.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', //get all Status
checkAuth_1.basicAuthUser, status_controller_1.getAllStatus);
router.get('/getSingleStatus', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), status_controller_1.getSingleStatus);
router.post('/', checkAuth_1.basicAuthUser, status_controller_1.createStatus);
router.put('/', // update status
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), status_controller_1.updateStatus);
router.delete('/', //delete Status
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), status_controller_1.deleteStatus);
router.put('/getFilterStatus', checkAuth_1.basicAuthUser, status_controller_1.getFilteredStatus);
exports.default = router;
//# sourceMappingURL=status.routes.js.map