import {Router} from 'express';
import {createSuperAdmin, getFilteredSuperAdmin,getSuperAdminForSearch} from '../controller/superAdmin.controller';
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

router.get('/getSuperAdminForSearch',
    basicAuthUser,
    checkSession,
    getSuperAdminForSearch);


export default router