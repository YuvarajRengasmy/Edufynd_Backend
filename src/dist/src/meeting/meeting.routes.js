"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meeting_controller_1 = require("./meeting.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, meeting_controller_1.getAllMeeting);
router.get('/getSingleMeeting', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), meeting_controller_1.getSingleMeeting);
router.post('/', checkAuth_1.basicAuthUser, meeting_controller_1.createMeeting);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), meeting_controller_1.updateMeeting);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), meeting_controller_1.deleteMeeting);
router.put('/getFilterMeeting', checkAuth_1.basicAuthUser, meeting_controller_1.getFilteredMeeting);
exports.default = router;
//# sourceMappingURL=meeting.routes.js.map