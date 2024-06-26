"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const login_controller_1 = require("../controller/login.controller");
const router = (0, express_1.Router)();
router.post('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkRequestBodyParams)('email'), (0, Validators_1.checkRequestBodyParams)('password'), login_controller_1.loginEmail);
// router.put('/forgotPassword',
//     basicAuthUser,
//     checkRequestBodyParams('email'),
//     checkRequestBodyParams('link'),
//     forgotPassword
// );
// router.put('/updatePassword',
//     basicAuthUser,
//     checkRequestBodyParams('_id'),
//     checkRequestBodyParams('password'),
//     updatePassword
// );
exports.default = router;
//# sourceMappingURL=login.routes.js.map