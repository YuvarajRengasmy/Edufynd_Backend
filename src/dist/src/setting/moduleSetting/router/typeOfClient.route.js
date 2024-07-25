"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeOfClient_controller_1 = require("../controller/typeOfClient.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, typeOfClient_controller_1.getAllTypeOfClient);
router.get('/getSingleTypeOfClient', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), typeOfClient_controller_1.getSingleTypeOfClient);
router.post('/', checkAuth_1.basicAuthUser, typeOfClient_controller_1.createTypeOfClient);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), typeOfClient_controller_1.updateTypeOfClient);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), typeOfClient_controller_1.deleteTypeOfClient);
router.put('/getFilterTypeOfClient', checkAuth_1.basicAuthUser, typeOfClient_controller_1.getFilteredTypeOfClient);
exports.default = router;
//# sourceMappingURL=typeOfClient.route.js.map