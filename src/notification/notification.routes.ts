import { Router } from 'express';
import { getAllNotification, getSingleNotification, createNotification, updateNotification, 
    deleteNotification, getFilteredNotification,
    activeNotification,
    deactivateNotification, } from './notification.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission} from '../utils/tokenManager';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllNotification
);

router.get('/getSingleNotification',
    basicAuthUser,
     checkQuery('_id'),
    getSingleNotification,
);



router.post('/',
    basicAuthUser,
    checkSession,
    createNotification
);



router.put('/',                   
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    // checkRequestBodyParams('_id'),
    updateNotification
);


router.post('/active',
    basicAuthUser,
    checkSession,
    activeNotification
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateNotification
);

router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteNotification
);

router.put('/getFilterNotification',
    basicAuthUser,
    getFilteredNotification,
);



export default router