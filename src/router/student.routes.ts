import {Router} from 'express';
import { getAllStudent,getSingleStudent, saveStudent,updateStudent, deleteStudent,  getFilteredStudentBySuperAdmin, csvToJson, 
    createStudentBySuperAdmin,getFilteredStudent,editStudentProfileBySuperAdmin,
    getNotification} from '../controller/student.controller';
import { forgotPassword } from '../controller/login.controller';
import { createContact} from '../controller/contact.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser,  } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded'
const router:Router=Router();



router.get('/',                        
    basicAuthUser,
     checkSession,
    getAllStudent
);


router.get('/getSingleStudent',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleStudent,
);
router.get('/get', 
    getNotification
)
router.post('/', 
         checkRequestBodyParams('email'),
        saveStudent
);

router.post('/contact', createContact);


router.put('/',             
    basicAuthUser,
    checkSession,
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
    deleteStudent
);


router.put('/getFilterStudent',
    basicAuthUser,
    checkSession,
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


router.put('/createStudentBySuperAdmin',             //create student by super Admin
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
  
    createStudentBySuperAdmin
);

router.put('/editStudentBySuperAdmin',             //Update student by super Admin
    basicAuthUser,
    checkSession,
    editStudentProfileBySuperAdmin
);

router.put('/forgot',             //create student by super Admin
    basicAuthUser,
    checkSession,
    // // checkQuery('_id'),
    forgotPassword
);



export default router