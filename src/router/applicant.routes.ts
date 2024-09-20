import {Router} from 'express';
import { courseApply, createApplicant, deleteApplicant, getAllApplicant, getAllApplicantCardDetails, getAllLoggedApplication, getFilteredApplication,
     getSingleApplicant, getStudentApplication, updateApplicant} from '../controller/applicant.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser,  } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';
const router:Router=Router();


router.get('/',               
    basicAuthUser,
     checkSession,
     checkPermission('application', 'view'),
    getAllApplicant
);


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedApplication
);

router.get('/card',               
    basicAuthUser,
     checkSession,
     checkPermission('application', 'view'),
    getAllApplicantCardDetails
);


router.get('/getSingleApplicant',
    basicAuthUser,
    checkSession,
    checkPermission('application', 'view'),
    checkQuery('_id'),
    getSingleApplicant,
);


router.post('/', 
         basicAuthUser,
         checkSession,
         checkPermission('application', 'add'),
         createApplicant
);


router.post('/courseApply', 
    basicAuthUser,
    checkSession,
    courseApply
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    checkPermission('application', 'edit'),
    checkRequestBodyParams('_id'),
    updateApplicant
);




router.delete('/',                
    basicAuthUser,
    checkSession,
    checkPermission('application', 'delete'),
    checkQuery('_id'),
    deleteApplicant
);


router.put('/getFilterApplicant',
    basicAuthUser,
    checkSession,
    checkPermission('application', 'view'),
    getFilteredApplication,
);

router.get('/getStudentApplication',
    basicAuthUser,
     checkQuery('studentId'),
    getStudentApplication,
);


export default router