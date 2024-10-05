import { Router } from 'express';
import { activeBranch, assignStaffId, createBranch, deactivateBranch, deleteBranch, getAllBranch, 
    getAllLoggedBranch, getFilteredBranch, getSingleBranch, getSingleLoggedBranch, updateBranch } from '../controller/branch.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';


const router: Router = Router();


router.get('/',
    basicAuthUser,
    checkSession,
    getAllBranch
);

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedBranch
);


router.get('/singleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedBranch
);

router.get('/getSingleBranch',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleBranch
);



router.post('/',
    basicAuthUser,
    checkSession,
    checkPermission('branch', 'add'),
    checkRequestBodyParams('email'),
    createBranch
);


router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('branch', 'edit'),
     checkRequestBodyParams('_id'),
    updateBranch
);

router.post('/activeBranch',
    basicAuthUser,
    checkSession,
    activeBranch
);

router.post('/deActiveBranch',
    basicAuthUser,
    checkSession,
    deactivateBranch
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('branch', 'delete'),
    checkQuery('_id'),
    deleteBranch
);


router.put('/getFilterBranch',
    basicAuthUser,
    checkSession,
    getFilteredBranch
);


export default router