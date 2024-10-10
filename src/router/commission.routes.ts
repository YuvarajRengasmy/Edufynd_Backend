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
import { getAllCommissionCardDetails } from '../cards/commissionCard.controller';


const router: Router = Router();

router.get('/',
    basicAuthUser,
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
    checkQuery('_id'),
    getSingleCommission,
);

router.get('/getSingleUniversity',
    basicAuthUser,
    checkQuery('universityId'),
    getSingleUniversity,
);


router.get('/card',
    basicAuthUser,
    checkSession,
    getAllCommissionCardDetails
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
    getFilteredCommission,
);



export default router