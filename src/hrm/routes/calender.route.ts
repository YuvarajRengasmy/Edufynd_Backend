import { Router } from 'express';
import { getAllCalender, getSingleCalender, createCalender, updateCalender, deleteCalender, getFilteredCalender } from '../controller/calender.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',               
    basicAuthUser,
    getAllCalender
);

router.get('/getSingleCalender',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCalender,
);


router.post('/',
    basicAuthUser,
    checkSession,
    createCalender
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    updateCalender
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteCalender
);

router.put('/getFilterCalender',
    basicAuthUser,
    getFilteredCalender,
);


export default router