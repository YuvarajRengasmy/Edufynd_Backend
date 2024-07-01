import {Router} from 'express';
import { getAllStudentEnquiry,getSingleStudentEnquiry, createStudentEnquiry,updateStudentEnquiry, deleteStudentEnquiry,getFilteredStudentEnquiry} from '../controller/studentEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
    //  checkSession,
    getAllStudentEnquiry
);


router.get('/getSingleStudentEnquiry',
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    getSingleStudentEnquiry,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createStudentEnquiry
);

router.put('/',             // update Enquiry
    basicAuthUser,
    // checkSession,
    checkRequestBodyParams('_id'),
    updateStudentEnquiry,
 
);


router.delete('/',                //delete Enquiry
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    deleteStudentEnquiry
);


router.put('/getFilterStudentEnquiry',
    basicAuthUser,
    // checkSession,
    getFilteredStudentEnquiry,
);



export default router