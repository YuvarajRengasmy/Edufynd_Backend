import {Router} from 'express';
import { createSuperAdmin, getFiltered} from '../controller/superAdmin.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.post('/', 
         checkRequestBodyParams('email'),
         createSuperAdmin
);


router.put('/getFilter',
    basicAuthUser,
    checkSession,
    getFiltered,
);



export default router