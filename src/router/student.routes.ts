import { Router } from 'express';
import {
    getAllStudent, getSingleStudent, saveStudent, updateStudent, deleteStudent, getFilteredStudentBySuperAdmin, csvToJson,
    createStudentBySuperAdmin, getFilteredStudent, editStudentProfileBySuperAdmin,
    getAllLoggedStudent,
    getSingleLoggedStudent,
    activeStudent,
    deactivateStudent,
    assignStaffId,
} from '../controller/student.controller';
import { forgotPassword } from '../controller/login.controller';
import { createContact } from '../controller/contact.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser, } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';
import upload from '../utils/fileUploaded'
const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('student', 'view'),
    getAllStudent
);


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedStudent
);

router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedStudent,
);

router.get('/getSingleStudent',
    basicAuthUser,
    checkSession,
    checkPermission('student', 'view'),
    checkQuery('_id'),
    getSingleStudent,
);


router.post('/',
    basicAuthUser,
    checkSession,
    checkPermission('student', 'add'),
    checkRequestBodyParams('email'),
    saveStudent
);

router.post('/register',
   
    checkRequestBodyParams('email'),
    saveStudent
);



router.post('/contact', createContact);


router.post('/activeStudent',
    basicAuthUser,
    checkSession,
    activeStudent
);

router.post('/deActiveStudent',
    basicAuthUser,
    checkSession,
    deactivateStudent
);


router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('student', 'edit'),
    checkRequestBodyParams('_id'),
    upload.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'passport', maxCount: 1 },
        { name: 'sslc', maxCount: 1 },
        { name: 'hsc', maxCount: 1 },
        { name: 'degree', maxCount: 10 },
        { name: 'additional', maxCount: 10 }
    ]),

    updateStudent,
);


router.delete('/',

    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    checkPermission('student', 'delete'),
    deleteStudent
);


router.put('/getFilterStudent',
    basicAuthUser,
    checkSession,
    checkPermission('student', 'view'),
    getFilteredStudent,
);


router.put('/getFilterStudentBySuperAdmin',
    basicAuthUser,
    checkSession,
    getFilteredStudentBySuperAdmin,
);


router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);


router.put('/createStudentBySuperAdmin',
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkPermission('student', 'edit'),
    createStudentBySuperAdmin
);

router.put('/editStudentBySuperAdmin',
    basicAuthUser,
    checkSession,
    checkPermission('student', 'edit'),
    editStudentProfileBySuperAdmin
);

router.put('/forgot',
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    forgotPassword
);



export default router