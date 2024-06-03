import {Router} from 'express';
import { createStudentBySuperAdmin, createSuperAdmin} from '../controller/superAdmin.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.post('/', 
         checkRequestBodyParams('email'),
         createSuperAdmin
);


router.put('/addStudent', //create student by superAdmin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStudentBySuperAdmin  
);


export default router