import { Router } from 'express';
const router: Router = Router();


// All Module Routes
import SuperAdmin from './superAdmin.routes'
import Admin from './admin.routes'
import Student from './student.routes'
import Agent from './agent.routes'
import Login from './login.routes'
import University from './university.routes'
import Program from './program.routes'
import Applicant from './applicant.routes'
import Contact from './contact.routes'
import Client from './client.routes'
import Staff from './staff.routes'
import Blog from '../blogs/blogs.routes'
import Commission from './commission.routes'
import Demo from './demo.routes'
import Payment from './payment.routes'
import DialCode from './dialCode.routes'
import Branch from './branch.routes'



// All Enquiry Routes
import GeneralEnquiry  from '../enquiries/routes/generalEnquiry.route';
import BusinessEnquiry  from '../enquiries/routes/businessEnquiry.route';
import StudentEnquiry from '../enquiries/routes/studentEnquiry.route'
import LoanEnquiry  from '../enquiries/routes/loanEnquiry.route';
import Accommodation from '../enquiries/routes/accommodation.route'
import Forex from '../enquiries/routes/forex.route'
import Flight from '../enquiries/routes/flightTicket.route'
import Chat from './chat.routes';

// Invoice Routes
import SenderInvoice from '../finance/routes/senderInvoice.route';
import ReceiverInvoice from '../finance/routes/receiverInvoice.route'


// Marketing
import SocialMedia from '../marketing/routes/socialMedia.routes'
import Campaign from '../marketing/routes/campaign.routes'
import DailyTask from '../marketing/routes/dailyTask.routes'
import Facebook from '../marketing/routes/facebook.route'

// Notification
import Notification from '../notification/notification.routes'

// Promotion
import Promotion from '../promotion/promotion.routes'

// Meeting
import Meeting from '../meeting/meeting.routes'

// Training
import Training from '../training/training.routes'

// Events
import Event from '../events/event.routes'

//Testimonial
import Testimonial from '../testimonial/testimonial.routes'

//ELT
// import ELT from '../ELT/elt.routes'




//HRMS
import Department from '../hrm/routes/department.route';
import Policies from '../hrm/routes/policies.route'
import Attendence from '../hrm/routes/attendence.route'
import PayRoll from '../hrm/routes/payroll.route'
import DepartmentHead from '../hrm/routes/departmentHead.route'
import Calender from '../hrm/routes/calender.route'
import Document from '../hrm/routes/document.route'



//Global Setting Routes
import Status from '../setting/globalSetting/router/status.routes'
import Source from '../setting/globalSetting/router/source.routes'
import Country from '../setting/globalSetting/router/country.routes'
import InTake from '../setting/globalSetting/router/intake.routes'
import Email from '../setting/globalSetting/router/email.routes'
import Currency from '../setting/globalSetting/router/currency.routes'
import Year from '../setting/globalSetting/router/year.routes'
import Category from '../setting/globalSetting/router/category.routes'



//Drop Down Setting Routes
import CourseType from '../setting/moduleSetting/router/courseType.route'
import PopularCategory from '../setting/moduleSetting/router/popularCourse.route'
import CommissionPaid from '../setting/moduleSetting/router/commissionPaid.route'
import InstitutionType from '../setting/moduleSetting/router/institutionType.route'
import OfferTAT from '../setting/moduleSetting/router/offerTAT.route'
import PaymentMethod from '../setting/moduleSetting/router/paymentMethod.route'
import Tax from '../setting/moduleSetting/router/tax.route'
import TypeOfClient from '../setting/moduleSetting/router/typeOfClient.route'
import ApplicationStatus from '../setting/moduleSetting/router/applicationStatus.route'
import Qualification from '../setting/moduleSetting/router/qualification.route'
import CommissionType from '../setting/moduleSetting/router/typeOfCommission.route'





// All Module API
router.use('/superadmin', SuperAdmin)
router.use('/admin', Admin)
router.use('/student', Student)
router.use('/agent', Agent)
router.use('/login', Login)
router.use('/university', University)
router.use('/program', Program)
router.use('/applicant', Applicant)
router.use('/contact', Contact)
router.use('/client', Client)
router.use('/staff', Staff)
router.use('/blog', Blog)
router.use('/commission', Commission)
router.use('/demo', Demo)
router.use('/chat', Chat)
router.use('/dialCode', DialCode)
router.use('/branch', Branch)


//All Enquiry API
router.use('/generalEnquiry', GeneralEnquiry)
router.use('/businessEnquiry', BusinessEnquiry)
router.use('/studentEnquiry', StudentEnquiry)
router.use('/loan', LoanEnquiry)
router.use('/accommodation', Accommodation)
router.use('/forex', Forex)
router.use('/flight', Flight)

// Invoice API
router.use('/senderInvoice', SenderInvoice)
router.use('/receiverInvoice', ReceiverInvoice)
router.use('/payment', Payment)

// Marketing
router.use('/socialMedia', SocialMedia)
router.use('/campaign', Campaign)
router.use('/dailyTask', DailyTask)
router.use('/facebook', Facebook)

// Notification
router.use('/notification', Notification)

// Meeting
router.use('/meeting', Meeting)

// Promotion
router.use('/promotion', Promotion)

// Training
router.use('/training', Training)

// Events
router.use('/event', Event)

//Testimonial
router.use('/testimonial', Testimonial)

//ELT




//HRMS
router.use('/department', Department)
router.use('/policies', Policies)
router.use('/attendence', Attendence)
router.use('/payroll', PayRoll)
router.use('/departmentHead', DepartmentHead)
router.use('/calender', Calender)
router.use('/document', Document)


//Global Setting API
router.use('/status', Status )
router.use('/source', Source )
router.use('/country', Country)
router.use('/intake', InTake)
router.use('/email', Email)
router.use('/currency', Currency)
router.use('/year', Year)
router.use('/category', Category)


//Drop Down - Setting API
router.use('/course', CourseType )
router.use('/popularCourse', PopularCategory )
router.use('/commissionPaid', CommissionPaid)
router.use('/institutionType', InstitutionType)
router.use('/offerTAT', OfferTAT)
router.use('/paymentMethod', PaymentMethod)
router.use('/tax', Tax)
router.use('/typeOfClient', TypeOfClient)
router.use('/applicationStatus', ApplicationStatus)
router.use('/qulaification', Qualification)
router.use('/commissionType', CommissionType)


export default router