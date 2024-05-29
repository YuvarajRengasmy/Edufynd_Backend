import {Router} from 'express';
import { createApplicant, getAllApplicant, getSingleApplicant } from '../controller/applicant.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();



router.get('/getallapplicant', //get all Applicant
    basicAuthUser,
     checkSession,
    getAllApplicant
);


router.get('/getsingleapplicant',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleApplicant,
);
router.post('/save', 
         checkRequestBodyParams('email'),
         createApplicant
);

export default router