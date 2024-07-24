"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, notification_controller_1.getAllNotification);
router.get('/getSingleNotification', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), notification_controller_1.getSingleNotification);
router.post('/', checkAuth_1.basicAuthUser, notification_controller_1.createNotification);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), notification_controller_1.updateNotification);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), notification_controller_1.deleteNotification);
router.put('/getFilterNotification', checkAuth_1.basicAuthUser, notification_controller_1.getFilteredNotification);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map