import { Router } from 'express';
import {
    getAllAdmin, getSingleAdmin, createAdmin, createStudentByAdmin, createStaffByAdmin, deleteAdmin,
    createAdminBySuperAdmin, editAdminProfileBySuperAdmin, getFilteredAdmin, editStudentProfileByAdmin,
    editStaffProfileByAdmin,
    updateAdmin,
    getAllLoggedAdmin,
    getSingleLoggedAdmin,
    activeAdmin,
    deactivateAdmin,
    assignStaffId 
} from '../controller/admin.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';

const router: Router = Router();


router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'view'),
    getAllAdmin
);

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedAdmin
);


router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedAdmin,
);

router.get('/getSingleAdmin',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleAdmin,
);



router.post('/',
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'add'),
    checkRequestBodyParams('email'),
    createAdmin
);


router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'edit'),
     checkRequestBodyParams('_id'),
    updateAdmin
);

router.post('/activeAdmin',
    basicAuthUser,
    checkSession,
    activeAdmin
);

router.post('/deActiveAdmin',
    basicAuthUser,
    checkSession,
    deactivateAdmin
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'delete'),
    checkQuery('_id'),
    deleteAdmin
);


router.put('/getFilterAdmin',
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'view'),
    getFilteredAdmin,
);

/// Super Admin can create and edit the admin profile

router.post('/createAdminBySuperAdmin',             //create admin by super Admin
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'add'),
    // checkQuery('_id'),
    createAdminBySuperAdmin
);


router.put('/editAdminBySuperAdmin',             //Update admin by super Admin
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'edit'),
    editAdminProfileBySuperAdmin
);


/// Admin can create and edit the student profile

router.post('/createStudentByAdmin',             //create student by Admin
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'add'),
    createStudentByAdmin
);

router.put('/editStudentByAdmin',             //Update student by Admin
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'edit'),
    editStudentProfileByAdmin
);

/// Admin can create and edit the staff profile

router.post('/createStaffByAdmin',             //create staff by  Admin
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'add'),
    createStaffByAdmin
);

router.put('/editStaffByAdmin',             //Update staff by Admin
    basicAuthUser,
    checkSession,
    checkPermission('admin', 'edit'),
    editStaffProfileByAdmin
);


export default router