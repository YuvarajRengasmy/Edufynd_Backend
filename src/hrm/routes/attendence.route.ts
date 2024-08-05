import { Router } from 'express';
import {  staffClockIn, staffClockOut} from '../controller/attendence.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.post('/clockIn', 
    basicAuthUser,
    // checkSession,
    staffClockIn
)

router.put('/clockOut', 
    basicAuthUser,
    // checkSession,
    staffClockOut
)


export default router