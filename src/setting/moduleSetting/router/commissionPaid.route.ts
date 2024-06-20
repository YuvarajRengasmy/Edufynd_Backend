import { Router } from 'express';
import { getAllCommissionPaid, getSingleCommissionPaid, createCommissionPaid, updateCommissionPaid, deleteCommissionPaid, getFilteredCommissionPaid} from '../../moduleSetting/controller/commissionPaid.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllCommissionPaid
);

router.get('/getSingleCommissionPaid',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCommissionPaid,
);


router.post('/',
    basicAuthUser,
    createCommissionPaid
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateCommissionPaid
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteCommissionPaid
);


router.put('/getFilterCommissionPaid',
    basicAuthUser,
    getFilteredCommissionPaid,
);



export default router