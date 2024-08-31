import { Router } from 'express';
import { getAllCommission, getSingleCommission,getSingleUniversity, createCommission, updateCommission, 
    deleteCommission, getFilteredCommission, 
    deleteCourseType,
    deleteIntake} from '../controller/commission.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllCommission
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


router.post('/',
    basicAuthUser,
    checkSession,
    createCommission
);


router.put('/',
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateCommission
);

router.post('/deleteCourseType', deleteCourseType);

router.post('/deleteIntake', deleteIntake);


router.delete('/',
    basicAuthUser,
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