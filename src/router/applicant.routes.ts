import {Router} from 'express';
import { createApplicant, deleteApplicant, getAllApplicant, getFilteredApplication, getSingleApplicant, updateApplicant } from '../controller/applicant.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.get('/',               //get all Applicant
    basicAuthUser,
    //  checkSession,
    getAllApplicant
);


router.get('/getSingleApplicant',
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    getSingleApplicant,
);


router.put('/', 
         basicAuthUser,
        //  checkSession,
         createApplicant
);


router.put('/',                    // update Applicant
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    // checkRequestBodyParams('_id'),
    updateApplicant
);


router.delete('/',                  //delete Applicant
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    deleteApplicant
);


router.put('/getFilterApplicant',
    basicAuthUser,
    // checkSession,
    getFilteredApplication,
);

export default router