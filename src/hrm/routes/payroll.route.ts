import { Router } from 'express';
import { getAllPayRoll, getSinglePayRoll, createPayRoll, updatePayRoll, deletePayRoll, getFilteredPayRoll, createPayrolll, calculateSalary } from '../controller/payroll.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',               
    basicAuthUser,
    getAllPayRoll
);

router.get('/getSinglePayRoll',
    basicAuthUser,
    checkQuery('_id'),
    getSinglePayRoll,
);


router.post('/',
    basicAuthUser,
    checkSession,
    createPayRoll
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    updatePayRoll
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deletePayRoll
);

router.put('/getFilterPayRoll',
    basicAuthUser,
    getFilteredPayRoll,
);


/////

router.post('/a', createPayrolll)

router.post('/b', calculateSalary)

export default router