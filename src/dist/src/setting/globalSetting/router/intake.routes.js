"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const intake_controller_1 = require("../../globalSetting/controller/intake.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', //get all InTake
checkAuth_1.basicAuthUser, intake_controller_1.getAllInTake);
router.get('/getSingleInTake', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), intake_controller_1.getSingleInTake);
router.post('/', checkAuth_1.basicAuthUser, intake_controller_1.createInTake);
router.put('/', // update status
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), intake_controller_1.updateInTake);
router.delete('/', //delete Status
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), intake_controller_1.deleteInTake);
router.put('/getFilterInTake', checkAuth_1.basicAuthUser, intake_controller_1.getFilteredInTake);
exports.default = router;
//# sourceMappingURL=intake.routes.js.map