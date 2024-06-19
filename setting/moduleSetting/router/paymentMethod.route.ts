import { Router } from 'express';
import { getAllPaymentMethod, getSinglePaymentMethod, createPaymentMethod, updatePaymentMethod, deletePaymentMethod, getFilteredPaymentMethod } from '../../moduleSetting/controller/paymentMethod.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllPaymentMethod
);

router.get('/getSinglePaymentMethod',
    basicAuthUser,
    checkQuery('_id'),
    getSinglePaymentMethod,
);


router.post('/',
    basicAuthUser,
    createPaymentMethod
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updatePaymentMethod
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deletePaymentMethod
);


router.put('/getFilterPaymentMethod',
    basicAuthUser,
    getFilteredPaymentMethod,
);



export default router