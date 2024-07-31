import {Router} from 'express';
import { getAllBusinessEnquiry,getSingleBusinessEnquiry, createBusinessEnquiry,updateBusinessEnquiry, deleteBusinessEnquiry, getFilteredBusinessEnquiry} from '../controller/businessEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
      checkSession,
    getAllBusinessEnquiry
);


router.get('/getSingleBusinessEnquiry',
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    getSingleBusinessEnquiry,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createBusinessEnquiry
);

router.put('/',          
    basicAuthUser,
     checkSession,
    checkRequestBodyParams('_id'),
    updateBusinessEnquiry,
 
);


router.delete('/',               
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    deleteBusinessEnquiry
);


router.put('/getFilterBusinessEnquiry',
    basicAuthUser,
     checkSession,
    getFilteredBusinessEnquiry,
);




export default router