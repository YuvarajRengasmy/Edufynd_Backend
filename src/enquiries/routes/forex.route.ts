import { Router } from 'express';
import { getAllForexEnquiry, getSingleForexEnquiry, createForexEnquiry, updateForexEnquiry, deleteForexEnquiry, getFilteredForexEnquiry } from '../controller/forex.controller';
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



export default router