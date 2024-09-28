import { Router } from 'express';
import {createPaymentIntent, checkOut} from '../controller/payment.controller';
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







export default router