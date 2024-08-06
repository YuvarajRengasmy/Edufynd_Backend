import { Router } from 'express';
import {  calculateAttendance, deleteAttendence, getAllAttendence, getFilteredAttendence, getSingleAttendence, staffClockIn, staffClockOut} from '../controller/attendence.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',               
    basicAuthUser,
    getAllAttendence
);

router.get('/getSingleAttendence',
    basicAuthUser,
    checkQuery('_id'),
    getSingleAttendence,
);

router.put('/clockIn', 
    basicAuthUser,
    // checkSession,
    staffClockIn
)

router.put('/clockOut', 
    basicAuthUser,
    // checkSession,
    checkRequestBodyParams('_id'),
    staffClockOut
)

router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteAttendence
);

router.put('/getFilterAttendence',
    basicAuthUser,
    getFilteredAttendence,
);

router.post('/', 
    basicAuthUser,
    // checkSession,
    calculateAttendance
)



export default router