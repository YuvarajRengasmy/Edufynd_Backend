import { Router } from 'express';
import { getAllEvent, getSingleEvent, createEvent, updateEvent, deleteEvent, getFilteredEvent } from './event.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';


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
    basicAuthUser,
    createEvent
);


router.put('/',                   
    basicAuthUser,
    checkQuery('_id'),
    updateEvent
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteEvent
);

router.put('/getFilterEvent',
    basicAuthUser,
    getFilteredEvent,
);

export default router