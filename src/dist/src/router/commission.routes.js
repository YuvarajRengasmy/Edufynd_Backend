"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commission_controller_1 = require("../controller/commission.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, commission_controller_1.getAllCommission);
router.get('/getSingleCommission', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), commission_controller_1.getSingleCommission);
router.post('/', checkAuth_1.basicAuthUser, commission_controller_1.createCommission);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), commission_controller_1.updateCommission);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), commission_controller_1.deleteCommission);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('commissionId'), (0, Validators_1.checkQuery)('yearId'), (0, Validators_1.checkQuery)('courseTypeId'), commission_controller_1.deleteCourseType);
router.put('/getFilterCommission', checkAuth_1.basicAuthUser, commission_controller_1.getFilteredCommission);
exports.default = router;
//# sourceMappingURL=commission.routes.js.map