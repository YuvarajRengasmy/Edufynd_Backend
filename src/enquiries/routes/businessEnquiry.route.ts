import { Router } from 'express';
import { getAllBusinessEnquiry, getSingleBusinessEnquiry, createBusinessEnquiry, updateBusinessEnquiry, deleteBusinessEnquiry, getFilteredBusinessEnquiry } from '../controller/businessEnquiry.controller';
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
    checkPermission('businessenquiry', 'view'),
    getFilteredBusinessEnquiry,
);




export default router