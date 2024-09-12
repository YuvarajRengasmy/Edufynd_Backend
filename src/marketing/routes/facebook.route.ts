import { Router } from 'express';
import {  getUserData, publishPost} from '../controller/facebook.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getUserData

);

router.get('/getSingleSocialMedia',
    basicAuthUser,
    checkQuery('_id'),
   
);


router.post('/create-facebook-post',
    // basicAuthUser,
    // checkSession,
    publishPost,
 
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
 
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
 
);

router.put('/getFilterSocialMedia',
    basicAuthUser,
 
);

export default router