import {Router} from 'express';
import { activeApplicant, assignStaffId, courseApply, createApplicant, deactivateApplicant, deleteApplicant, getAllApplicant, getAllApplicantCardDetails, getAllLoggedApplication, getFilteredApplication,
     getSingleApplicant, getSingleLoggedApplicant, getStudentApplication, updateApplicant} from '../controller/applicant.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser,  } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';
const router:Router=Router();


router.get('/',               
    basicAuthUser,
     checkSession,
    getAllApplicant
);


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedApplication
);


router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedApplicant,
);


router.get('/card',               
    basicAuthUser,
     checkSession,
    getAllApplicantCardDetails
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

router.post('/activeApplicant',
    basicAuthUser,
    checkSession,
    activeApplicant
);

router.post('/deActiveApplicant',
    basicAuthUser,
    checkSession,
    deactivateApplicant
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)


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
    getFilteredApplication,
);

router.get('/getStudentApplication',
    basicAuthUser,
     checkQuery('studentId'),
    getStudentApplication,
);


export default router