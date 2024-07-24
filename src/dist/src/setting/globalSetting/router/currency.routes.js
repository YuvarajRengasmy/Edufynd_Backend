"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const currency_controller_1 = require("../../globalSetting/controller/currency.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', //get all Currency
checkAuth_1.basicAuthUser, currency_controller_1.getAllCurrency);
router.get('/getSingleCurrency', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), currency_controller_1.getSingleCurrency);
router.post('/', checkAuth_1.basicAuthUser, currency_controller_1.createCurrency);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), currency_controller_1.deleteCurrency);
router.put('/getFilterCurrency', checkAuth_1.basicAuthUser, currency_controller_1.getFilteredCurrency);
exports.default = router;
//# sourceMappingURL=currency.routes.js.map