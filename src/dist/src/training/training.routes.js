"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const training_controller_1 = require("./training.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, training_controller_1.getAllTraining);
router.get('/getSingleTraining', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), training_controller_1.getSingleTraining);
router.post('/', checkAuth_1.basicAuthUser, training_controller_1.createTraining);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), training_controller_1.updateTraining);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), training_controller_1.deleteTraining);
router.put('/getFilterTraining', checkAuth_1.basicAuthUser, training_controller_1.getFilteredTraining);
exports.default = router;
//# sourceMappingURL=training.routes.js.map