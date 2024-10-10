import { Router } from 'express';
import {createPaymentIntent, checkOut, cashFreePayment} from '../controller/payment.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';


const router: Router = Router();



router.post('/',
    basicAuthUser,
    checkPermission('payment', 'add'),
    createPaymentIntent 
);



router.post('/create-checkout-session',checkOut);


router.post('/cash', cashFreePayment)







export default router