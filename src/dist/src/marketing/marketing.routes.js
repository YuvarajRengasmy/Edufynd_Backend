"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marketing_controller_1 = require("./marketing.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, marketing_controller_1.getAllMarketing);
router.get('/getSingleMarketing', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), marketing_controller_1.getSingleMarketing);
router.post('/', checkAuth_1.basicAuthUser, marketing_controller_1.createMarketing);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), marketing_controller_1.updateMarketing);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), marketing_controller_1.deleteMarketing);
router.put('/getFilterMarketing', checkAuth_1.basicAuthUser, marketing_controller_1.getFilteredMarketing);
exports.default = router;
//# sourceMappingURL=marketing.routes.js.map