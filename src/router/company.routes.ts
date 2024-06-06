import {Router} from 'express';
import { saveCompany, findO } from '../controller/company.controller';
import { checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
const router:Router=Router();

router.post('/save',
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('password'),
    saveCompany
);
router.post("/find",findO)
export default router;