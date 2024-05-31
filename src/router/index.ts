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

//Global Setting Routes
import Status from '../setting/globalSetting/router/status.routes'
import Country from '../setting/globalSetting/router/country.routes'
import InTake from '../setting/globalSetting/router/intake.routes'
import Email from '../setting/globalSetting/router/email.routes'
import Currency from '../setting/globalSetting/router/currency.routes'



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

//Global Setting API
router.use('/status', Status )
router.use('/country', Country)
router.use('/intake', InTake)
router.use('/email', Email)
router.use('/currency', Currency)





export default router