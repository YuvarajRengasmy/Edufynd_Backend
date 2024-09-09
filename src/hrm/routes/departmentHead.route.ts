import { Router } from 'express';
import { getAllDepartmentHead, getSingleDepartmentHead, createDepartmentHead, updateDepartmentHead, deleteDepartmentHead, 
    getFilteredDepartmentHead } from '../controller/departmentHead.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',               
    basicAuthUser,
    getAllDepartmentHead
);

router.get('/getSingleDepartmentHead',
    basicAuthUser,
    checkQuery('_id'),
    getSingleDepartmentHead,
);


router.post('/',
    basicAuthUser,
    checkSession,
    createDepartmentHead
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateDepartmentHead
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteDepartmentHead
);

router.put('/getFilterDepartmentHead',
    basicAuthUser,
    getFilteredDepartmentHead,
);


export default router