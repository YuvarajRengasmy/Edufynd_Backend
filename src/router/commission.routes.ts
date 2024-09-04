import { Router } from 'express';
import { getAllCommission, getSingleCommission,getSingleUniversity, createCommission, updateCommission, 
    deleteCommission, getFilteredCommission, 
    deleteCourseType,
    deleteIntake} from '../controller/commission.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkPermission('commission', 'view'),
    getAllCommission
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

router.post('/deleteCourseType', 
    checkPermission('commission', 'delete'),
    deleteCourseType);

router.post('/deleteIntake', 
    checkPermission('commission', 'delete'),
    deleteIntake);


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