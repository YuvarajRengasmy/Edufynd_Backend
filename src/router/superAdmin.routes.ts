import {Router} from 'express';
import { createAdminBySuperAdmin, createAgentBySuperAdmin, createStaffBySuperAdmin, createStudentBySuperAdmin, createSuperAdmin} from '../controller/superAdmin.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.post('/', 
         checkRequestBodyParams('email'),
         createSuperAdmin
);


router.put('/createStudent',             //create student by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStudentBySuperAdmin
);

router.put('/createAgent',             //create agent by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createAgentBySuperAdmin
);


router.put('/createAdmin',             //create admin by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createAdminBySuperAdmin
);


router.put('/createStaff',             //create staff by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStaffBySuperAdmin
);


export default router