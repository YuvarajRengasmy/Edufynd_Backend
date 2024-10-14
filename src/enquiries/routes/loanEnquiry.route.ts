import { Router } from 'express';
import { getAllLoanEnquiry, getSingleLoanEnquiry, createLoanEnquiry, updateLoanEnquiry, deleteLoanEnquiry, getFilteredLoanEnquiry, getAllLoggedLoanEnquiry, getSingleLoggedLoanEnquiry, activeLoanEnquiry, deactivateLoanEnquiry, assignStaffId } from '../controller/loanEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';
import { getAllLoanEnquiryCard } from '../../cards/loanCard.controller';

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


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedLoanEnquiry
);


router.get('/singleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedLoanEnquiry
);


router.get('/card',
    basicAuthUser,
    checkSession,
    getAllLoanEnquiryCard
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

router.post('/active',
    basicAuthUser,
    checkSession,
    activeLoanEnquiry
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateLoanEnquiry
);


router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)

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

//Public API

router.get('/public', getAllLoanEnquiry);

router.get('/publicGetSingleLoanEnquiry', getSingleLoanEnquiry);

router.post('/public', createLoanEnquiry);

export default router