import {Router} from 'express';
import { getAllAdmin,getSingleAdmin, createAdmin, createStudentByAdmin, createStaffByAdmin, deleteAdmin} from '../controller/admin.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.get('/',                      //get all admin
    basicAuthUser,
     checkSession,
    getAllAdmin
);


router.get('/getSingleAdmin',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleAdmin,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createAdmin
);


router.delete('/',                  //delete admin
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteAdmin
);

router.post('/createStudentByAdmin',             //create student by Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStudentByAdmin
);


router.post('/createStaffByAdmin',             //create staff by  Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStaffByAdmin
);


export default router