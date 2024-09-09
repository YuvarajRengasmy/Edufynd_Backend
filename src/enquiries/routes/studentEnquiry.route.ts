import { Router } from 'express';
import { getAllStudentEnquiry, getSingleStudentEnquiry, createStudentEnquiry, updateStudentEnquiry, deleteStudentEnquiry, getFilteredStudentEnquiry } from '../controller/studentEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('studentEnquiry', 'view'),
    getAllStudentEnquiry
);


router.get('/getSingleStudentEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('studentEnquiry', 'view'),
    checkQuery('_id'),
    getSingleStudentEnquiry,
);

router.post('/',
    checkPermission('studentEnquiry', 'add'),
    checkRequestBodyParams('email'),
    createStudentEnquiry
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('studentEnquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateStudentEnquiry,

);


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('studentEnquiry', 'delete'),
    checkQuery('_id'),
    deleteStudentEnquiry
);


router.put('/getFilterStudentEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('studentEnquiry', 'view'),
    getFilteredStudentEnquiry,
);



export default router