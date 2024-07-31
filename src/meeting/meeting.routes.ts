import { Router } from 'express';
import { getAllMeeting, getSingleMeeting, createMeeting, updateMeeting, deleteMeeting, getFilteredMeeting } from './meeting.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';


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