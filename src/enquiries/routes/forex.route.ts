import { Router } from 'express';
import { getAllForexEnquiry, getSingleForexEnquiry, createForexEnquiry, updateForexEnquiry, deleteForexEnquiry, getFilteredForexEnquiry, getAllLoggedForex, getSingleLoggedForex, activeForex, deactivateForex, assignStaffId } from '../controller/forex.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('forexEnquiry', 'view'),
    getAllForexEnquiry
);


router.get('/getSingleForexEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('forexEnquiry', 'view'),
    checkQuery('_id'),
    getSingleForexEnquiry,
);

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedForex
);


router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedForex
);

router.post('/',
    basicAuthUser,
    checkSession,
    checkPermission('forexEnquiry', 'add'),
    checkRequestBodyParams('email'),
    createForexEnquiry
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('forexEnquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateForexEnquiry,

);


router.post('/active',
    basicAuthUser,
    checkSession,
    activeForex
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateForex
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)

router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('forexEnquiry', 'delete'),
    checkQuery('_id'),
    deleteForexEnquiry
);


router.put('/getFilterForex',
    basicAuthUser,
    checkSession,
    checkPermission('forexEnquiry', 'view'),
    getFilteredForexEnquiry,
);


//Public API

router.get('/public', getAllForexEnquiry);

router.get('/publicGetSingleForexEnquiry', getSingleForexEnquiry);

router.post('/public', createForexEnquiry);

export default router