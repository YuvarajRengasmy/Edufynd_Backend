"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promotion_controller_1 = require("./promotion.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, promotion_controller_1.getAllPromotion);
router.get('/getSinglePromotion', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), promotion_controller_1.getSinglePromotion);
router.post('/', checkAuth_1.basicAuthUser, promotion_controller_1.createPromotion);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), promotion_controller_1.updatePromotion);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), promotion_controller_1.deletePromotion);
router.put('/getFilterPromotion', checkAuth_1.basicAuthUser, promotion_controller_1.getFilteredPromotion);
exports.default = router;
//# sourceMappingURL=promotion.routes.js.map