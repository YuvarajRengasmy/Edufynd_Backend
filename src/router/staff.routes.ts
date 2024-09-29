import { Router } from 'express';
import { getAllStaff, getSingleStaff, createStaff, updateStaff, deleteStaff, getFilteredStaff, csvToJson,
    createStaffBySuperAdmin, createStudentByStaff,
    getAllLoggedStaff,
    getSingleLoggedStaff,
    activeStaff,
    deactivateStaff,
    assignAdminId, 
   } from '../controller/staff.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser, } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';

const router: Router = Router();

router.get('/',              
    basicAuthUser,
    checkSession,
    // checkPermission('staff', 'view'),
    getAllStaff
);


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedStaff
);

router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedStaff,
);


router.get('/getSingleStaff',
    basicAuthUser,
    checkSession,
    // checkPermission('staff', 'view'),
    checkQuery('_id'),
    getSingleStaff,
);


router.post('/',           
    basicAuthUser,
    checkSession,
    checkPermission('staff', 'add'),
    createStaff
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    checkPermission('staff', 'edit'),
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateStaff
);


router.post('/activeStaff',
    basicAuthUser,
    checkSession,
    activeStaff
);

router.post('/deActiveStaff',
    basicAuthUser,
    checkSession,
    deactivateStaff
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignAdminId
)


router.delete('/',                  
    basicAuthUser,
    checkSession,
    checkPermission('staff', 'delete'),
    checkQuery('_id'),
    deleteStaff
);

router.post('/createStudentByStaff',             //create student by staff
    basicAuthUser,
    checkSession,
    checkPermission('staff', 'add'),
    // checkQuery('_id'),
    createStudentByStaff
);


router.post('/createStaffBySuperAdmin',             //create staff by super Admin
    basicAuthUser,
    checkSession,
    checkPermission('staff', 'add'),
    // checkQuery('_id'),
    createStaffBySuperAdmin
);

router.put('/getFilterStaffSuperAdmin',
    basicAuthUser,
    checkSession,
    // checkPermission('staff', 'view'),
    getFilteredStaff,
);


router.post('/import',    
    upload.single('file'),
    csvToJson
);




export default router