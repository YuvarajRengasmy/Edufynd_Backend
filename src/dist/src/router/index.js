"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// All Module Routes
const superAdmin_routes_1 = require("./superAdmin.routes");
const admin_routes_1 = require("./admin.routes");
const student_routes_1 = require("./student.routes");
const agent_routes_1 = require("./agent.routes");
const login_routes_1 = require("./login.routes");
const university_routes_1 = require("./university.routes");
const program_routes_1 = require("./program.routes");
const applicant_routes_1 = require("./applicant.routes");
const contact_routes_1 = require("./contact.routes");
const client_routes_1 = require("./client.routes");
const staff_routes_1 = require("./staff.routes");
const blogs_routes_1 = require("../blogs/blogs.routes");
const commission_routes_1 = require("./commission.routes");
// All Enquiry Routes
const generalEnquiry_route_1 = require("../enquiries/routes/generalEnquiry.route");
const businessEnquiry_route_1 = require("../enquiries/routes/businessEnquiry.route");
const studentEnquiry_route_1 = require("../enquiries/routes/studentEnquiry.route");
const loanEnquiry_route_1 = require("../enquiries/routes/loanEnquiry.route");
const accommodation_route_1 = require("../enquiries/routes/accommodation.route");
const forex_route_1 = require("../enquiries/routes/forex.route");
const flightTicket_route_1 = require("../enquiries/routes/flightTicket.route");
// Invoice Routes
const senderInvoice_route_1 = require("../finance/routes/senderInvoice.route");
const receiverInvoice_route_1 = require("../finance/routes/receiverInvoice.route");
// Marketing
const marketing_routes_1 = require("../marketing/marketing.routes");
// Notification
const notification_routes_1 = require("../notification/notification.routes");
// Promotion
const promotion_routes_1 = require("../promotion/promotion.routes");
// Meeting
const meeting_routes_1 = require("../meeting/meeting.routes");
// Training
const training_routes_1 = require("../training/training.routes");
// Events
const event_routes_1 = require("../events/event.routes");
//Global Setting Routes
const status_routes_1 = require("../setting/globalSetting/router/status.routes");
const country_routes_1 = require("../setting/globalSetting/router/country.routes");
const intake_routes_1 = require("../setting/globalSetting/router/intake.routes");
const email_routes_1 = require("../setting/globalSetting/router/email.routes");
const currency_routes_1 = require("../setting/globalSetting/router/currency.routes");
const year_routes_1 = require("../setting/globalSetting/router/year.routes");
//Drop Down Setting Routes
const courseType_route_1 = require("../setting/moduleSetting/router/courseType.route");
const popularCourse_route_1 = require("../setting/moduleSetting/router/popularCourse.route");
const commissionPaid_route_1 = require("../setting/moduleSetting/router/commissionPaid.route");
const country_route_1 = require("../setting/moduleSetting/router/country.route");
const institutionType_route_1 = require("../setting/moduleSetting/router/institutionType.route");
const offerTAT_route_1 = require("../setting/moduleSetting/router/offerTAT.route");
const paymentMethod_route_1 = require("../setting/moduleSetting/router/paymentMethod.route");
const tax_route_1 = require("../setting/moduleSetting/router/tax.route");
const typeOfClient_route_1 = require("../setting/moduleSetting/router/typeOfClient.route");
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
router.use('/blog', blogs_routes_1.default);
router.use('/commission', commission_routes_1.default);
//All Enquiry API
router.use('/generalEnquiry', generalEnquiry_route_1.default);
router.use('/businessEnquiry', businessEnquiry_route_1.default);
router.use('/studentEnquiry', studentEnquiry_route_1.default);
router.use('/loan', loanEnquiry_route_1.default);
router.use('/accommodation', accommodation_route_1.default);
router.use('/forex', forex_route_1.default);
router.use('/flight', flightTicket_route_1.default);
// Invoice API
router.use('/senderInvoice', senderInvoice_route_1.default);
router.use('/receiverInvoice', receiverInvoice_route_1.default);
// Marketing
router.use('/marketing', marketing_routes_1.default);
// Notification
router.use('/notification', notification_routes_1.default);
// Meeting
router.use('/meeting', meeting_routes_1.default);
// Promotion
router.use('/promotion', promotion_routes_1.default);
// Training
router.use('/training', training_routes_1.default);
// Events
router.use('/event', event_routes_1.default);
//Global Setting API
router.use('/status', status_routes_1.default);
router.use('/country', country_routes_1.default);
router.use('/intake', intake_routes_1.default);
router.use('/email', email_routes_1.default);
router.use('/currency', currency_routes_1.default);
router.use('/year', year_routes_1.default);
//Drop Down - Setting API
router.use('/course', courseType_route_1.default);
router.use('/popularCourse', popularCourse_route_1.default);
router.use('/commissionPaid', commissionPaid_route_1.default);
router.use('/institutionType', institutionType_route_1.default);
router.use('/countryList', country_route_1.default);
router.use('/offerTAT', offerTAT_route_1.default);
router.use('/paymentMethod', paymentMethod_route_1.default);
router.use('/tax', tax_route_1.default);
router.use('/typeOfClient', typeOfClient_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map