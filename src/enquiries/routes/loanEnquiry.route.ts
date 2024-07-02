import {Router} from 'express';
import { getAllLoanEnquiry,getSingleLoanEnquiry, createLoanEnquiry,updateLoanEnquiry, deleteLoanEnquiry,getFilteredLoanEnquiry} from '../controller/loanEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
    //  checkSession,
    getAllLoanEnquiry
);


router.get('/getSingleLoanEnquiry',
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    getSingleLoanEnquiry,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createLoanEnquiry
);

router.put('/',          
    basicAuthUser,
    // checkSession,
    checkRequestBodyParams('_id'),
    updateLoanEnquiry,
 
);


router.delete('/',               
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    deleteLoanEnquiry
);


router.put('/getFilterLoanEnquiry',
    basicAuthUser,
    // checkSession,
    getFilteredLoanEnquiry,
);



export default router