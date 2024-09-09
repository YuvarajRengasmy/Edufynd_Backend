import { Router } from 'express';
import { getAllEvent, getSingleEvent, createEvent, updateEvent, deleteEvent, getFilteredEvent, deleteFileFromEvent } from './event.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllEvent
);

router.get('/getSingleEvent',
    basicAuthUser,
    checkQuery('_id'),
    getSingleEvent,
);


router.post('/',
    // basicAuthUser,
    // checkSession,
    createEvent
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    updateEvent
);


router.post('/deleteFile', deleteFileFromEvent);

router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteEvent
);

router.put('/getFilterEvent',
    basicAuthUser,
    checkSession,
    getFilteredEvent,
);

export default router