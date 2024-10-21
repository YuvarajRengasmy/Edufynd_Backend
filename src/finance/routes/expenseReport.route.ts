import { Router } from 'express';
import { activeExpense, createExpenseReport, deactivateExpense, deleteExpenseReport, getAllExpenseReport, getFilteredExpenseReport, getSingleExpenseReport, updateExpense } from '../controller/expenseReport.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    getAllExpenseReport
);


router.get('/getSingleExpense',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleExpenseReport
);

router.post('/activeExpense',
    basicAuthUser,
    checkSession,
    activeExpense
);

router.post('/deActiveExpense',
    basicAuthUser,
    checkSession,
    deactivateExpense
);

router.post('/',
    basicAuthUser,
    checkSession,
    createExpenseReport
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateExpense

);


router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteExpenseReport
);


router.put('/getFilterExpense',
    basicAuthUser,
    checkSession,
    getFilteredExpenseReport
);


export default router