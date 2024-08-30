import { Router } from 'express';
import {getAllPayment, getSinglePayment, createPaymentIntent, updatePayment, deletePayment, 
    getFilteredPayment, 
    checkOut} from '../controller/payment.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllPayment
);
router.get('/getSinglePayment',
    basicAuthUser,
    checkQuery('_id'),
    getSinglePayment ,
);
router.post('/',
    basicAuthUser,
    createPaymentIntent 
);



router.post('/create-checkout-session',checkOut);



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
router.put('/getFilterPayment',
    basicAuthUser,
    getFilteredPayment ,
);



export default router