import { Router } from 'express';
import { getAllFacebook, getSingleFacebook, createFacebookPost, updateFacebook,
     deleteFacebook, getFilteredFacebook } from '../controller/facebook.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllFacebook
);

router.get('/getSingleSocialMedia',
    basicAuthUser,
    checkQuery('_id'),
    getSingleFacebook,
);


router.post('/create-facebook-post',
    // basicAuthUser,
    // checkSession,
    createFacebookPost
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    updateFacebook
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteFacebook
);

router.put('/getFilterSocialMedia',
    basicAuthUser,
    getFilteredFacebook,
);

export default router