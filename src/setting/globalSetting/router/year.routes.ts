import { Router } from 'express';
import { getAllYear, getSingleYear, createYear, updateYear, deleteYear, getFilteredYear } from '../../globalSetting/controller/year.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllYear
);

router.get('/getSingleYear',
    basicAuthUser,
    checkQuery('_id'),
    getSingleYear,
);


router.post('/',
    basicAuthUser,
    createYear
);


router.put('/',                   
    basicAuthUser,
    checkQuery('_id'),
    updateYear
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteYear
);


router.put('/getFilterYear',
    basicAuthUser,
    getFilteredYear,
);


export default router