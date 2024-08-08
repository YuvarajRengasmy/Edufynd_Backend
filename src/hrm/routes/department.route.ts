import { Router } from 'express';
import { getAllDepartment, getSingleDepartment, createDepartment, updateDepartment, deleteDepartment, getFilteredDepartment } from '../controller/department.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',               
    basicAuthUser,
    getAllDepartment
);

router.get('/getSingleDepartment',
    basicAuthUser,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    getSingleDepartment,
);


router.post('/',
    basicAuthUser,
    checkSession,
    createDepartment
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    updateDepartment
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteDepartment
);

router.put('/getFilterDepartment',
    basicAuthUser,
    getFilteredDepartment,
);


export default router