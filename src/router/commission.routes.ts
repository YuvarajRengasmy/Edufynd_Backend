import { Router } from 'express';
import {
    getAllCommission, getSingleCommission, getSingleUniversity, createCommission, updateCommission,
    deleteCommission, getFilteredCommission,
    deleteCourseType,
    deleteIntake,
    getAllLoggedCommission,
    getSingleLoggedCommission,
    activeCommission,
    deactivateCommission
} from '../controller/commission.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkPermission('commission', 'view'),
    getAllCommission
);

router.get('/logs',
    basicAuthUser,
    checkSession,
    getAllLoggedCommission
);


router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedCommission,
);


router.get('/getSingleCommission',
    basicAuthUser,
    checkPermission('commission', 'view'),
    checkQuery('_id'),
    getSingleCommission,
);

router.get('/getSingleUniversity',
    basicAuthUser,
    checkPermission('commission', 'view'),
    checkQuery('universityId'),
    getSingleUniversity,
);


router.post('/',
    basicAuthUser,
    checkSession,
    checkPermission('commission', 'add'),
    createCommission
);


router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('commission', 'edit'),
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateCommission
);

router.post('/activeCommission',
    basicAuthUser,
    checkSession,
    activeCommission
);

router.post('/deActiveCommission',
    basicAuthUser,
    checkSession,
    deactivateCommission
);

router.post('/deleteCourseType',deleteCourseType);

router.post('/deleteIntake',deleteIntake);


router.delete('/',
    basicAuthUser,
    checkPermission('commission', 'delete'),
    checkQuery('_id'),
    deleteCommission
);

router.delete('/courseType',
    basicAuthUser,
    checkQuery('commissionId'),
    checkQuery('yearId'),
    checkQuery('courseTypeId'),
    deleteCourseType
);


router.put('/getFilterCommission',
    basicAuthUser,
    checkPermission('commission', 'delete'),
    getFilteredCommission,
);



export default router