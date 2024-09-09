import { Router } from 'express';
import { getAllPromotion, getSinglePromotion, createPromotion, updatePromotion, deletePromotion, getFilteredPromotion } from './promotion.controller';
import { checkQuery, checkRequestBodyParams} from '../middleware/Validators';
import { checkSession } from '../utils/tokenManager';
import { basicAuthUser } from '../middleware/checkAuth';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllPromotion
);

router.get('/getSinglePromotion',
    basicAuthUser,
    checkQuery('_id'),
    getSinglePromotion,
);


router.post('/',
    basicAuthUser,
    checkSession,
    createPromotion
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    updatePromotion
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deletePromotion
);

router.put('/getFilterPromotion',
    basicAuthUser,
    getFilteredPromotion,
);

export default router