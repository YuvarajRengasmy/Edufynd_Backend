"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// All Module Routes
const superAdmin_routes_1 = __importDefault(require("./superAdmin.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const student_routes_1 = __importDefault(require("./student.routes"));
const agent_routes_1 = __importDefault(require("./agent.routes"));
const login_routes_1 = __importDefault(require("./login.routes"));
const university_routes_1 = __importDefault(require("./university.routes"));
const program_routes_1 = __importDefault(require("./program.routes"));
const applicant_routes_1 = __importDefault(require("./applicant.routes"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const client_routes_1 = __importDefault(require("./client.routes"));
const staff_routes_1 = __importDefault(require("./staff.routes"));
//Global Setting Routes
const status_routes_1 = __importDefault(require("../setting/globalSetting/router/status.routes"));
const country_routes_1 = __importDefault(require("../setting/globalSetting/router/country.routes"));
const intake_routes_1 = __importDefault(require("../setting/globalSetting/router/intake.routes"));
const email_routes_1 = __importDefault(require("../setting/globalSetting/router/email.routes"));
const currency_routes_1 = __importDefault(require("../setting/globalSetting/router/currency.routes"));
//Drop Down Setting Routes
const courseType_route_1 = __importDefault(require("../setting/moduleSetting/router/courseType.route"));
const popularCourse_route_1 = __importDefault(require("../setting/moduleSetting/router/popularCourse.route"));
const commissionPaid_route_1 = __importDefault(require("../setting/moduleSetting/router/commissionPaid.route"));
const country_route_1 = __importDefault(require("../setting/moduleSetting/router/country.route"));
const institutionType_route_1 = __importDefault(require("../setting/moduleSetting/router/institutionType.route"));
const offerTAT_route_1 = __importDefault(require("../setting/moduleSetting/router/offerTAT.route"));
const paymentMethod_route_1 = __importDefault(require("../setting/moduleSetting/router/paymentMethod.route"));
const tax_route_1 = __importDefault(require("../setting/moduleSetting/router/tax.route"));
const typeOfClient_route_1 = __importDefault(require("../setting/moduleSetting/router/typeOfClient.route"));
// All Module API
router.use('/superadmin', superAdmin_routes_1.default);
router.use('/admin', admin_routes_1.default);
router.use('/student', student_routes_1.default);
router.use('/agent', agent_routes_1.default);
router.use('/login', login_routes_1.default);
router.use('/university', university_routes_1.default);
router.use('/program', program_routes_1.default);
router.use('/applicant', applicant_routes_1.default);
router.use('/contact', contact_routes_1.default);
router.use('/client', client_routes_1.default);
router.use('/staff', staff_routes_1.default);
//Global Setting API
router.use('/status', status_routes_1.default);
router.use('/country', country_routes_1.default);
router.use('/intake', intake_routes_1.default);
router.use('/email', email_routes_1.default);
router.use('/currency', currency_routes_1.default);
//Drop Down - Setting API
router.use('/course', courseType_route_1.default);
router.use('/popularCourse', popularCourse_route_1.default);
router.use('/commissionPaid', commissionPaid_route_1.default);
router.use('/institutionType', institutionType_route_1.default);
router.use('/countryName', country_route_1.default);
router.use('/offerTAT', offerTAT_route_1.default);
router.use('/paymentMethod', paymentMethod_route_1.default);
router.use('/tax', tax_route_1.default);
router.use('/typeOfClient', typeOfClient_route_1.default);
exports.default = router;
