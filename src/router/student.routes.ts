import {Router} from 'express';
import { getAllStudent,getSingleStudent, saveStudent,updateStudent, deleteStudent,  getFilteredStudentBySuperAdmin} from '../controller/student.controller';
import { createContact} from '../controller/contact.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();



router.get('/getAll',                          //get all users
    basicAuthUser,
     checkSession,
    getAllStudent
);


router.get('/getSingle',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleStudent,
);

router.post('/', 
         checkRequestBodyParams('email'),
        saveStudent
);




router.post('/contact', createContact);



router.put('/',             // update user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateStudent
);


router.delete('/',                //delete user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteStudent
);



router.put('/getFilterStudent',
    basicAuthUser,
    checkSession,
    getFilteredStudentBySuperAdmin,
);


export default router