import { Router } from 'express';
import { getAllSocialMedia, getSingleSocialMedia, createSocialMedia, updateSocialMedia,
     deleteSocialMedia, getFilteredSocialMedia } from '../controller/socialMedia.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';


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
    createSocialMedia
);


router.put('/',                   
    basicAuthUser,
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