import { Router } from 'express';
import { getAllTestimonial, getSingleTestimonial, createTestimonial, updateTestimonial,
     deleteTestimonial,getSingleLogged, getFilteredTestimonial, 
     activeTestimonial,
     deactivateTestimonial,
     getAllLoggedTestimonial,
     getSingleLoggedTestimonial,
     assignStaffId} from './testimonial.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission} from '../utils/tokenManager';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    checkSession,
    getAllTestimonial
);

router.get('/getSingleTestimonial',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleTestimonial,
);
router.get('/getSingleLogged',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLogged,
);

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedTestimonial
);


router.get('/singleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedTestimonial
);

router.post('/',
    basicAuthUser,
    checkSession,
    createTestimonial
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    updateTestimonial
);


router.post('/active',
    basicAuthUser,
    checkSession,
    activeTestimonial
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateTestimonial
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)

router.delete('/',                  
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteTestimonial
);

router.put('/getFilterTestimonial',
    basicAuthUser,
    checkSession,
    getFilteredTestimonial,
);

export default router