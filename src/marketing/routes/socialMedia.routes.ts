import { Router } from 'express';
import { getAllSocialMedia, getSingleSocialMedia, createSocialMedia, updateSocialMedia,
     deleteSocialMedia, getFilteredSocialMedia } from '../controller/socialMedia.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllSocialMedia
);

router.get('/getSingleSocialMedia',
    basicAuthUser,
    checkQuery('_id'),
    getSingleSocialMedia,
);


router.post('/',
    basicAuthUser,
    checkSession,
    createSocialMedia
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    updateSocialMedia
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteSocialMedia
);

router.put('/getFilterSocialMedia',
    basicAuthUser,
    getFilteredSocialMedia,
);

export default router