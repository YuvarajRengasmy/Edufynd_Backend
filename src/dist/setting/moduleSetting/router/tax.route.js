"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tax_controller_1 = require("../../moduleSetting/controller/tax.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, tax_controller_1.getAllTax);
router.get('/getSingleTax', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), tax_controller_1.getSingleTax);
router.post('/', checkAuth_1.basicAuthUser, tax_controller_1.createTax);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), tax_controller_1.updateTax);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), tax_controller_1.deleteTax);
router.put('/getFilterTax', checkAuth_1.basicAuthUser, tax_controller_1.getFilteredTax);
exports.default = router;
//# sourceMappingURL=tax.route.js.map