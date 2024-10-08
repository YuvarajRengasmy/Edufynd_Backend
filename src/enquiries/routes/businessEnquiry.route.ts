import { Router } from 'express';
import { getAllBusinessEnquiry, getSingleBusinessEnquiry, createBusinessEnquiry, updateBusinessEnquiry, deleteBusinessEnquiry, getFilteredBusinessEnquiry, getAllLoggedBusinessEnquiry, getSingleLoggedBusinessEnquiry, activeBusinessEnquiry, deactivateBusinessEnquiry, assignStaffId } from '../controller/businessEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('businessEnquiry', 'view'),
    getAllBusinessEnquiry
);


router.get('/getSingleBusinessEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('businessEnquiry', 'view'),
    checkQuery('_id'),
    getSingleBusinessEnquiry,
);


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedBusinessEnquiry
);


router.get('/singleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedBusinessEnquiry
);


router.post('/',
    checkPermission('businessEnquiry', 'add'),
    checkRequestBodyParams('email'),
    createBusinessEnquiry
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('businessEnquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateBusinessEnquiry,

);


router.post('/active',
    basicAuthUser,
    checkSession,
    activeBusinessEnquiry
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateBusinessEnquiry
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)

router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('businessEnquiry', 'delete'),
    checkQuery('_id'),
    deleteBusinessEnquiry
);


router.put('/getFilterBusinessEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('businessEnquiry', 'view'),
    getFilteredBusinessEnquiry,
);


//Public API

router.get('/public', getAllBusinessEnquiry);

router.get('/publicGetSingleBusinessEnquiry', getSingleBusinessEnquiry);

router.post('/public', createBusinessEnquiry);


export default router