"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("./event.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, event_controller_1.getAllEvent);
router.get('/getSingleEvent', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), event_controller_1.getSingleEvent);
router.post('/', checkAuth_1.basicAuthUser, event_controller_1.createEvent);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), event_controller_1.updateEvent);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), event_controller_1.deleteEvent);
router.put('/getFilterEvent', checkAuth_1.basicAuthUser, event_controller_1.getFilteredEvent);
exports.default = router;
//# sourceMappingURL=event.routes.js.map