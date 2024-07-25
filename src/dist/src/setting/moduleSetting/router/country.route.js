"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const country_controller_1 = require("../../moduleSetting/controller/country.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, country_controller_1.getAllCountryList);
router.get('/getSingleCountryList', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), country_controller_1.getSingleCountryList);
router.post('/', checkAuth_1.basicAuthUser, country_controller_1.createCountryList);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), country_controller_1.updateCountryList);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), country_controller_1.deleteCountryList);
router.put('/getFilterCountryList', checkAuth_1.basicAuthUser, country_controller_1.getFilteredCountryList);
router.get('/getCountryByState', checkAuth_1.basicAuthUser, country_controller_1.getCountryByState);
router.get('/getAllCities', checkAuth_1.basicAuthUser, country_controller_1.getAllCities);
exports.default = router;
//# sourceMappingURL=country.route.js.map