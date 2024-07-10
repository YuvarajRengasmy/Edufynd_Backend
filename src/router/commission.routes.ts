import { Router } from 'express';
import { getAllCommission, getSingleCommission, createCommission, updateCommission, deleteCommission, getFilteredCommission} from '../controller/commission.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllCommission
);

router.get('/getSingleCommission',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCommission,
);


router.post('/',
    basicAuthUser,
    createCommission
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateCommission
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteCommission
);


router.put('/getFilterCommission',
    basicAuthUser,
    getFilteredCommission,
);



export default router