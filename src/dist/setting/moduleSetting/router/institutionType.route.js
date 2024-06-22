"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const institutionType_controller_1 = require("../../moduleSetting/controller/institutionType.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, institutionType_controller_1.getAllInstitutionType);
router.get('/getSingleInstitutionType', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), institutionType_controller_1.getSingleInstitutionType);
router.post('/', checkAuth_1.basicAuthUser, institutionType_controller_1.createInstitutionType);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), institutionType_controller_1.updateInstitutionType);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), institutionType_controller_1.deleteInstitutionType);
router.put('/getFilterInstitutionType', checkAuth_1.basicAuthUser, institutionType_controller_1.getFilteredInstitutionType);
exports.default = router;
//# sourceMappingURL=institutionType.route.js.map