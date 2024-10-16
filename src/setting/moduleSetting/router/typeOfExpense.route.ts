import { Router } from 'express';
import { createExpense, deleteExpense, getAllExpense, getFilteredExpense, getSingleExpense, updateExpense } from '../../moduleSetting/controller/typeOfExpense.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';



const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllExpense
);

router.get('/getSingleExpense',
    basicAuthUser,
    checkQuery('_id'),
    getSingleExpense
);


router.post('/',
    basicAuthUser,
    createExpense
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateExpense
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteExpense
);


router.put('/getFilterExpense',
    basicAuthUser,
    getFilteredExpense
);



export default router