import { Router } from 'express';
import { getAllLoanEnquiry, getSingleLoanEnquiry, createLoanEnquiry, updateLoanEnquiry, deleteLoanEnquiry, getFilteredLoanEnquiry } from '../controller/loanEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('loanEnquiry', 'view'),
    getAllLoanEnquiry
);


router.get('/getSingleLoanEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('loanEnquiry', 'view'),
    checkQuery('_id'),
    getSingleLoanEnquiry,
);

router.post('/',
    checkPermission('loanEnquiry', 'add'),
    checkRequestBodyParams('email'),
    createLoanEnquiry
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('loanEnquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateLoanEnquiry,

);


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('loanEnquiry', 'delete'),
    checkQuery('_id'),
    deleteLoanEnquiry
);


router.put('/getFilterLoanEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('loanEnquiry', 'view'),
    getFilteredLoanEnquiry,
);



export default router