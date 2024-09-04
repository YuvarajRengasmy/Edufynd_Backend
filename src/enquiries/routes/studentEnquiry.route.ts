import { Router } from 'express';
import { getAllStudentEnquiry, getSingleStudentEnquiry, createStudentEnquiry, updateStudentEnquiry, deleteStudentEnquiry, getFilteredStudentEnquiry } from '../controller/studentEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('studentenquiry', 'view'),
    getAllStudentEnquiry
);


router.get('/getSingleStudentEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('studentenquiry', 'view'),
    checkQuery('_id'),
    getSingleStudentEnquiry,
);

router.post('/',
    checkPermission('studentenquiry', 'add'),
    checkRequestBodyParams('email'),
    createStudentEnquiry
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('studentenquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateStudentEnquiry,

);


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('studentenquiry', 'delete'),
    checkQuery('_id'),
    deleteStudentEnquiry
);


router.put('/getFilterStudentEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('studentenquiry', 'view'),
    getFilteredStudentEnquiry,
);



export default router