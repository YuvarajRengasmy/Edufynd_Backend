import { Router } from 'express';
import { getAllStudentEnquiry, getSingleStudentEnquiry, createStudentEnquiry, updateStudentEnquiry, deleteStudentEnquiry, getFilteredStudentEnquiry, getAllLoggedStudentEnquiry, getSingleLoggedStudentEnquiry, activeStudentEnquiry, deactivateStudentEnquiry, assignStaffId } from '../controller/studentEnquiry.controller';
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


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedStudentEnquiry
);


router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedStudentEnquiry
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


router.post('/active',
    basicAuthUser,
    checkSession,
    activeStudentEnquiry
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateStudentEnquiry
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


router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)



//Public API

router.get('/public', getAllStudentEnquiry);

router.get('/publicGetSingleStudentEnquiry', getSingleStudentEnquiry);

router.post('/public', createStudentEnquiry);

export default router