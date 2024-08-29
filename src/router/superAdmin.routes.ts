import {Router} from 'express';
import {createSuperAdmin, getFilteredSuperAdmin,getSuperAdminForSearch, getSingleSuperAdmin, getAllSuperAdmin} from '../controller/superAdmin.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();



router.get('/',                        
    basicAuthUser,
     checkSession,
    getAllSuperAdmin
);

router.get('/getSingleSuperAdmin',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleSuperAdmin,
);

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


    router.get('/publicGetSuperAdminForSearch',getSuperAdminForSearch);
  
export default router