import { Router } from 'express';
import { deleteAttendence, getAllAttendence, getFilteredAttendence, getSingleAttendence, staffClockIn, staffClockOut, 
    updateAttendence} from '../controller/attendence.controller';
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

router.put('/',                    
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    updateAttendence
);


router.post('/clockIn', 
    basicAuthUser,
    checkSession,
    staffClockIn
)

router.put('/clockOut', 
    basicAuthUser,
     checkSession,
    //   checkRequestBodyParams('_id'),
    checkQuery('_id'),
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

export default router