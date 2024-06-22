"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const popularCourse_controller_1 = require("../../moduleSetting/controller/popularCourse.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, popularCourse_controller_1.getAllPopularCategory);
router.get('/getSinglePopularCategory', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), popularCourse_controller_1.getSinglePopularCategory);
router.post('/', checkAuth_1.basicAuthUser, popularCourse_controller_1.createPopularCategory);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), popularCourse_controller_1.updatePopularCategory);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), popularCourse_controller_1.deletePopularCategory);
router.put('/getFilterPopularCategory', checkAuth_1.basicAuthUser, popularCourse_controller_1.getFilteredPopularCategory);
exports.default = router;
//# sourceMappingURL=popularCourse.route.js.map