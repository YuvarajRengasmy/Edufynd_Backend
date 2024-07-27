import { Router } from 'express';
import { checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { loginEmail, forgotPassword, resetPassword} from '../controller/login.controller';
const router: Router = Router();

router.post('/',

    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('password'),
    loginEmail
);

router.put('/forgotPassword',
    basicAuthUser,
    checkRequestBodyParams('link'),
    forgotPassword
);


router.put('/resetPassword',
    basicAuthUser,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('password'),
    checkRequestBodyParams('confirmPassword'),
    resetPassword
);



export default router;