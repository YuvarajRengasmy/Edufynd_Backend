import {Router} from 'express';
import { createIncomeReport, deleteIncomeReport, getAllIncomeReport, getFilteredIncomeReport, getSingleIncomeReport, updateIncome } from '../controller/incomeReport.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
      checkSession,
    getAllIncomeReport
);


router.get('/getSingleIncome',
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    getSingleIncomeReport
);

router.post('/', 
    basicAuthUser,
    checkSession,
         createIncomeReport
);

router.put('/',             
    basicAuthUser,
     checkSession,
    checkRequestBodyParams('_id'),
    updateIncome
 
);


router.delete('/',                
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    deleteIncomeReport
);


router.put('/getFilterIncome',
    basicAuthUser,
     checkSession,
    getFilteredIncomeReport
);



export default router