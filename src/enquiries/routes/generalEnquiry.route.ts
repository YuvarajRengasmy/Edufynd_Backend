import { Router } from 'express';
import { getAllGeneralEnquiry, getSingleGeneralEnquiry, createGeneralEnquiry, updateGeneralEnquiry, deleteGeneralEnquiry, getFilteredGeneralEnquiry } from '../controller/generalEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('generalenquiry', 'view'),
    getAllGeneralEnquiry
);


router.get('/getSingleGeneralEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('generalenquiry', 'view'),
    checkQuery('_id'),
    getSingleGeneralEnquiry,
);

router.post('/',
    checkPermission('generalenquiry', 'add'),
    checkRequestBodyParams('email'),
    createGeneralEnquiry
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('generalenquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateGeneralEnquiry,

);


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('generalenquiry', 'delete'),
    checkQuery('_id'),
    deleteGeneralEnquiry
);


router.put('/getFilterGeneralEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('generalenquiry', 'view'),
    getFilteredGeneralEnquiry,
);




export default router