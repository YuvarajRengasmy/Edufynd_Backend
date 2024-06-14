import {Router} from 'express';
import { createAdminBySuperAdmin, createAgentBySuperAdmin, createStaffBySuperAdmin, createStudentBySuperAdmin, createSuperAdmin, getFilteredSuperAdmin} from '../controller/superAdmin.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.post('/', 
         checkRequestBodyParams('email'),
         createSuperAdmin
);


router.put('/getFilterSuperAdmin',
    basicAuthUser,
    checkSession,
    getFilteredSuperAdmin,
);

router.post('/createStudent',             //create student by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStudentBySuperAdmin
);

router.post('/createAgent',             //create agent by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createAgentBySuperAdmin
);


router.post('/createAdmin',             //create admin by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createAdminBySuperAdmin
);


router.post('/createStaff',             //create staff by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStaffBySuperAdmin
);


export default router