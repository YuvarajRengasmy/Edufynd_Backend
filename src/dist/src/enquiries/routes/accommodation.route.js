"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accommodation_controller_1 = require("../controller/accommodation.controller");
const Validators_1 = require("../../middleware/Validators");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, 
//  checkSession,
accommodation_controller_1.getAllAccommodation);
router.get('/getSingleAccommodation', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), accommodation_controller_1.getSingleAccommodation);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), accommodation_controller_1.createAccommodation);
router.put('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), accommodation_controller_1.updateAccommodation);
router.delete('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), accommodation_controller_1.deleteAccommodationEnquiry);
router.put('/getFilterAccommodation', checkAuth_1.basicAuthUser, 
// checkSession,
accommodation_controller_1.getFilteredAccommodation);
exports.default = router;
//# sourceMappingURL=accommodation.route.js.map