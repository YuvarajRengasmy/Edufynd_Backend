import { Router } from 'express';
import { getAllTestimonial, getSingleTestimonial, createTestimonial, updateTestimonial,
     deleteTestimonial, getFilteredTestimonial } from './testimonial.controller';
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