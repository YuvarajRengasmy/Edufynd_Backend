import {Router} from 'express';
import { getAllAdmin,getSingleAdmin, createAdmin, createStudentByAdmin, createStaffByAdmin, deleteAdmin, 
    createAdminBySuperAdmin, editAdminProfileBySuperAdmin, getFilteredAdmin,
    editStudentProfileByAdmin,
    editStaffProfileByAdmin} from '../controller/admin.controller';
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


router.put('/getFilterAdmin',
    basicAuthUser,
    checkSession,
    getFilteredAdmin,
);

/// Super Admin can create and edit the admin profile

router.post('/createAdminBySuperAdmin',             //create admin by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createAdminBySuperAdmin
);


router.put('/editAdminBySuperAdmin',             //Update admin by super Admin
    basicAuthUser,
    // checkSession,
    editAdminProfileBySuperAdmin
);


/// Admin can create and edit the student profile

router.post('/createStudentByAdmin',             //create student by Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStudentByAdmin
);

router.put('/editStudentByAdmin',             //Update student by Admin
    basicAuthUser,
    checkSession,
    editStudentProfileByAdmin
);

/// Admin can create and edit the staff profile

router.post('/createStaffByAdmin',             //create staff by  Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStaffByAdmin
);

router.put('/editStaffByAdmin',             //Update staff by Admin
    basicAuthUser,
    checkSession,
    editStaffProfileByAdmin
);


export default router