import { Router } from 'express';
import {getAllDialCode, getSingleDialCode,getFilteredDialCode,  } from '../controller/dialCode.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';

const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllDialCode
);
router.get('/getSingleDialCode',
    basicAuthUser,
    checkQuery('_id'),
    getSingleDialCode ,
);

router.put('/getFilterDialCode',
    basicAuthUser,
    getFilteredDialCode ,
);


export default router