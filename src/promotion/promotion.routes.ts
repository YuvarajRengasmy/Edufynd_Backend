import { Router } from 'express';
import { getAllPromotion, getSinglePromotion, createPromotion, updatePromotion, deletePromotion, getFilteredPromotion, activePromotion, deactivatePromotion } from './promotion.controller';
import { checkQuery, checkRequestBodyParams} from '../middleware/Validators';
import { checkSession, checkPermission} from '../utils/tokenManager';
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


router.post('/active',
    basicAuthUser,
    checkSession,
    activePromotion
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivatePromotion
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