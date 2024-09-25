import { Router } from 'express';
import { getAllEvent, getSingleEvent, createEvent, updateEvent, deleteEvent, getFilteredEvent, deleteFileFromEvent, activeEvent, deactivateEvent, getAllLoggedEvent, getSingleLoggedEvent } from './event.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession,checkPermission } from '../utils/tokenManager';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    checkSession,
    getAllEvent
);

router.get('/getSingleEvent',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleEvent,
);

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedEvent
);


router.get('/singleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedEvent
);


router.post('/',
    basicAuthUser,
    checkSession,
    checkSession,
    createEvent
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    updateEvent
);

router.post('/active',
    basicAuthUser,
    checkSession,
    activeEvent
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateEvent
);


router.post('/deleteFile', deleteFileFromEvent);

router.delete('/',                  
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteEvent
);

router.put('/getFilterEvent',
    basicAuthUser,
    checkSession,
    getFilteredEvent,
);

export default router