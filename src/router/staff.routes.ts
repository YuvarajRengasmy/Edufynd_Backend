import { Router } from 'express';
import { getAllStaff, getSingleStaff, createStaff, updateStaff, deleteStaff, getFilteredStaff, csvToJson,
    createStaffBySuperAdmin, createStudentByStaff, 
    staffClockIn,
    staffClockOut} from '../controller/staff.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser, } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';

const router: Router = Router();

router.get('/',              
    basicAuthUser,
    checkSession,
    getAllStaff
);

router.get('/getSingleStaff',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleStaff,
);


router.post('/',           
    basicAuthUser,
    checkSession,
    createStaff
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateStaff
);


router.delete('/',                  
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteStaff
);

router.post('/createStudentByStaff',             //create student by staff
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStudentByStaff
);


router.post('/createStaffBySuperAdmin',             //create staff by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStaffBySuperAdmin
);

router.put('/getFilterStaffSuperAdmin',
    basicAuthUser,
    checkSession,
    getFilteredStaff,
);


router.post('/import',    
    upload.single('file'),
    csvToJson
);


router.post('/clockIn', staffClockIn)

router.post('/clockOut', staffClockOut)

export default router