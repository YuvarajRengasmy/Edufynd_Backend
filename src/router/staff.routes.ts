import { Router } from 'express';
import { getAllStaff, getSingleStaff, createStaff, updateStaff, deleteStaff, getFilteredStaff, csvToJson,createStaffBySuperAdmin } from '../controller/staff.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';

const router: Router = Router();

router.get('/',                //get all staff Details
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


router.post('/',           // create staff
    basicAuthUser,
    checkSession,
    createStaff
);


router.put('/',                    // update Staff Details
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateStaff
);


router.delete('/',                  //delete staff
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteStaff
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


router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);

export default router