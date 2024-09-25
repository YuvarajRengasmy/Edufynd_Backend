import { Router } from 'express';
import { getAllMeeting, getSingleMeeting, createMeeting, updateMeeting, deleteMeeting, getFilteredMeeting, activeMeeting, deactivateMeeting, getAllLoggedMeeting, getSingleLoggedMeeting, assignStaffId } from './meeting.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission} from '../utils/tokenManager';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllMeeting
);

router.get('/getSingleMeeting',
    basicAuthUser,
    checkQuery('_id'),
    getSingleMeeting,
);

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedMeeting
);


router.get('/singleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedMeeting
);


router.post('/',
    basicAuthUser,
    checkSession,
    createMeeting
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    updateMeeting
);


router.post('/active',
    basicAuthUser,
    checkSession,
    activeMeeting
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateMeeting
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)

router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteMeeting
);

router.put('/getFilterMeeting',
    basicAuthUser,
    getFilteredMeeting,
);

export default router