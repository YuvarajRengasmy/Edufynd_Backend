import {Router} from 'express';
import { getAllAdmin,getSingleAdmin, createAdmin} from '../controller/admin.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.get('/getallAdmin', //get all admin
    basicAuthUser,
     checkSession,
    getAllAdmin
);


router.get('/getsingleadmin',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleAdmin,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createAdmin
);



export default router