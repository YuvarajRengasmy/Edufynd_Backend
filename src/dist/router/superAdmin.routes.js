"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const superAdmin_controller_1 = require("../controller/superAdmin.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), superAdmin_controller_1.createSuperAdmin);
router.put('/getFilterSuperAdmin', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, superAdmin_controller_1.getFilteredSuperAdmin);
exports.default = router;
//# sourceMappingURL=superAdmin.routes.js.map