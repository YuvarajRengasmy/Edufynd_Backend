import { Router } from 'express';
import { getAllELT, getSingleELT, createELT, updateELT, deleteELT, getFilteredELT } from './elt.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllELT
);

router.get('/getSingleELT',
    basicAuthUser,
    checkQuery('_id'),
    getSingleELT,
);


router.post('/',
    basicAuthUser,
    createELT
);


router.put('/',                   
    basicAuthUser,
    // checkQuery('_id'),
    updateELT
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteELT
);

router.put('/getFilterELT',
    basicAuthUser,
    getFilteredELT,
);

export default router