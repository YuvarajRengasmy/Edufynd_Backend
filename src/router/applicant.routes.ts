import {Router} from 'express';
import { createApplicant, deleteApplicant, getAllApplicant, getFilteredApplication,
     getSingleApplicant, updateApplicant, trackApplicant} from '../controller/applicant.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser,  } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.get('/',               
    basicAuthUser,
     checkSession,
    getAllApplicant
);


router.get('/getSingleApplicant',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleApplicant,
);


router.post('/', 
         basicAuthUser,
         checkSession,
         createApplicant
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateApplicant
);




router.delete('/',                
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteApplicant
);


router.put('/getFilterApplicant',
    basicAuthUser,
    checkSession,
    getFilteredApplication,
);


/////

router.put('/track',                    
  
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    trackApplicant
);

export default router