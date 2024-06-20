"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const country_controller_1 = require("../../globalSetting/controller/country.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/getAllCountry', //get all Country
checkAuth_1.basicAuthUser, country_controller_1.getAllCountry);
router.get('/getSingleCountry', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), country_controller_1.getSingleCountry);
router.post('/', checkAuth_1.basicAuthUser, country_controller_1.createCountry);
router.put('/', // update Country
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), country_controller_1.updateCountry);
router.delete('/', //delete Country
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), country_controller_1.deleteCountry);
router.put('/getFilterCountry', checkAuth_1.basicAuthUser, country_controller_1.getFilteredCountry);
exports.default = router;