import { Router } from 'express';
import { getAllStaff, getSingleStaff, createStaff, updateStaff, deleteStaff } from '../controller/staff.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';

const router: Router = Router();

router.get('/getallstaff',                //get all staff Details
    basicAuthUser,
    checkSession,
    getAllStaff
);

router.get('/getsinglestaff',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleStaff,
);


router.post('/',           // create staff
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    // checkRequestBodyParams('_id'),
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


export default router