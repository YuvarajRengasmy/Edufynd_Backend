import { Router } from 'express';
import {getAllPayment, getSinglePayment, createPaymentIntent, updatePayment, deletePayment, 
    getFilteredPayment } from '../controller/payment.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';

const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllPayment
);
router.get('/getSingleDemo',
    basicAuthUser,
    checkQuery('_id'),
    getSinglePayment ,
);
router.post('/',
    basicAuthUser,
    createPaymentIntent 
);
router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updatePayment 
);
router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deletePayment 
);
router.put('/getFilterDemo',
    basicAuthUser,
    getFilteredPayment ,
);



export default router