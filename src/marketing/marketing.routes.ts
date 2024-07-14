import { Router } from 'express';
import { getAllMarketing, getSingleMarketing, createMarketing, updateMarketing, deleteMarketing, getFilteredMarketing } from './marketing.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllMarketing
);

router.get('/getSingleMarketing',
    basicAuthUser,
    checkQuery('_id'),
    getSingleMarketing,
);


router.post('/',
    basicAuthUser,
    createMarketing
);


router.put('/',                   
    basicAuthUser,
    checkQuery('_id'),
    updateMarketing
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteMarketing
);

router.put('/getFilterMarketing',
    basicAuthUser,
    getFilteredMarketing,
);

export default router