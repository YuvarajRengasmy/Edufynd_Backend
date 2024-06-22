"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseType_controller_1 = require("../../moduleSetting/controller/courseType.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, courseType_controller_1.getAllCourseTypeList);
router.get('/getSingleCourseType', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), courseType_controller_1.getSingleCourseTypeList);
router.post('/', checkAuth_1.basicAuthUser, courseType_controller_1.createCourseType);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), courseType_controller_1.updateCourseTypeList);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), courseType_controller_1.deleteCourseType);
router.put('/getFilterCourseType', checkAuth_1.basicAuthUser, courseType_controller_1.getFilteredCourseType);
exports.default = router;
//# sourceMappingURL=courseType.route.js.map