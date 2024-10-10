import { Router } from 'express';
import { createCommissionType, deleteCommissionType, getAllCommissionType, getFilteredCommissionType, getSingleCommissionType, updateCommissionType } from '../../moduleSetting/controller/typeOfCommission.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllCommissionType
);

router.get('/getSingleCommissionType',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCommissionType
);


router.post('/',
    basicAuthUser,
    createCommissionType
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateCommissionType
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteCommissionType
);


router.put('/getFilterCommissionType',
    basicAuthUser,
    getFilteredCommissionType
);



export default router