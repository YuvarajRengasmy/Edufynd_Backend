"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const year_controller_1 = require("../../globalSetting/controller/year.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, year_controller_1.getAllYear);
router.get('/getSingleYear', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), year_controller_1.getSingleYear);
router.post('/', checkAuth_1.basicAuthUser, year_controller_1.createYear);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), year_controller_1.updateYear);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), year_controller_1.deleteYear);
router.put('/getFilterYear', checkAuth_1.basicAuthUser, year_controller_1.getFilteredYear);
exports.default = router;
//# sourceMappingURL=year.routes.js.map