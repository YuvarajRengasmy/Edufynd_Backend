import {Router} from 'express';
import { getAllStudent,getSingleStudent, saveStudent,updateStudent, deleteStudent} from '../controller/student.controller';
import { createContact} from '../controller/contact.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
const router:Router=Router();



router.get('/get', //get all users
    basicAuthUser,
     checkSession,
    getAllStudent
);


router.get('/getsinglestudent',
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



router.put('/update', // update user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateStudent
);


router.delete('/delete', //delete user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteStudent
);


export default router