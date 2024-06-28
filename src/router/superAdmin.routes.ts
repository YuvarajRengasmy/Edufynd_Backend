import {Router} from 'express';
import {createSuperAdmin, getFilteredSuperAdmin} from '../controller/superAdmin.controller';
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
    // checkSession,
    getFilteredSuperAdmin,
);


export default router