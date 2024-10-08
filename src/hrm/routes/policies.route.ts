import { Router } from 'express';
import { getAllPolicies, getSinglePolicies, createPolicies,getPoliciesStaff, updatePolicies, deletePolicies, getFilteredPolicies } from '../controller/policies.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',               
    basicAuthUser,
    getAllPolicies
);

router.get('/getSinglePolicies',
    basicAuthUser,
    checkQuery('_id'),
    getSinglePolicies,
);


router.post('/',
    basicAuthUser,
    checkSession,
    createPolicies
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    updatePolicies
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deletePolicies
);

router.put('/getFilterPolicies',
    basicAuthUser,
    getFilteredPolicies,
);
router.get('/getPoliciesDepartment',    /// Get university details with that university program          
    checkQuery('department'),
    getPoliciesStaff   
);

export default router