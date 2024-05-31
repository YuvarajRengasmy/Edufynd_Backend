import { Router } from 'express';
import { getAllInTake, getSingleInTake, createInTake, updateInTake, deleteInTake, getFilteredInTake } from '../../globalSetting/controller/intake.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/getAllInTake',                //get all InTake
    basicAuthUser,
    getAllInTake
);

router.get('/getSingleInTake',
    basicAuthUser,
    checkQuery('_id'),
    getSingleInTake,
);


router.post('/',
    basicAuthUser,
    createInTake
);


router.put('/',                    // update status
    basicAuthUser,
    checkQuery('_id'),
    updateInTake
);


router.delete('/',                  //delete Status
    basicAuthUser,
    checkQuery('_id'),
    deleteInTake
);

router.put('/getFilterInTake',
    basicAuthUser,
    getFilteredInTake,
);

export default router