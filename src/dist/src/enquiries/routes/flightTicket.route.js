"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const flightTicket_controller_1 = require("../controller/flightTicket.controller");
const Validators_1 = require("../../middleware/Validators");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, 
//  checkSession,
flightTicket_controller_1.getAllFlightTicketEnquiry);
router.get('/getSingleFlightEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), flightTicket_controller_1.getSingleFlightTicketEnquiry);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), flightTicket_controller_1.createFlightTicketEnquiry);
router.put('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), flightTicket_controller_1.updateFlightTicketEnquiry);
router.delete('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), flightTicket_controller_1.deleteFlightTicketEnquiry);
router.put('/getFilterFlightEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
flightTicket_controller_1.getFilteredFlightTicketEnquiry);
exports.default = router;
//# sourceMappingURL=flightTicket.route.js.map