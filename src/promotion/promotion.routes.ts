import { Router } from 'express';
import { getAllPromotion, getSinglePromotion, createPromotion, updatePromotion, deletePromotion, getFilteredPromotion, activePromotion, deactivatePromotion, getAllLoggedPromotion, getSingleLoggedPromotion, assignStaffId } from './promotion.controller';
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


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedPromotion
);


router.get('/singleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedPromotion
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

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)

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