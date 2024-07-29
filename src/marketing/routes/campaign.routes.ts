import { Router } from 'express';
import { getAllCampaign, getSingleCampaign, createCampaign, updateCampaign,
     deleteCampaign, getFilteredCampaign } from '../controller/campaign.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllCampaign
);

router.get('/getSingleCampaign',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCampaign,
);


router.post('/',
    basicAuthUser,
    createCampaign
);


router.put('/',                   
    basicAuthUser,
    checkQuery('_id'),
    updateCampaign
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteCampaign
);

router.put('/getFilterCampaign',
    basicAuthUser,
    getFilteredCampaign,
);

export default router