import { Router } from 'express';
import { getAllGeneralEnquiry, getSingleGeneralEnquiry, createGeneralEnquiry, updateGeneralEnquiry, deleteGeneralEnquiry, getFilteredGeneralEnquiry, getAllLoggedGeneralEnquiry, getSingleLoggedGeneralEnquiry } from '../controller/generalEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('generalEnquiry', 'view'),
    getAllGeneralEnquiry
);


router.get('/getSingleGeneralEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('generalEnquiry', 'view'),
    checkQuery('_id'),
    getSingleGeneralEnquiry,
);


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedGeneralEnquiry
);


router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedGeneralEnquiry
);


router.post('/',
     checkPermission('generalEnquiry', 'add'),
    checkRequestBodyParams('email'),
    createGeneralEnquiry
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('generalEnquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateGeneralEnquiry,

);


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('generalEnquiry', 'delete'),
    checkQuery('_id'),
    deleteGeneralEnquiry
);


router.put('/getFilterGeneralEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('generalEnquiry', 'view'),
    getFilteredGeneralEnquiry,
);


//Public API

router.get('/public', getAllGeneralEnquiry);

router.get('/publicGetSingleGeneralEnquiry', getSingleGeneralEnquiry);

router.post('/public', createGeneralEnquiry);

export default router