import { Router } from 'express';
import { getAllStatus, getSingleStatus, createStatus, updateStatus, deleteStatus, getFilteredStatus } from '../../globalSetting/controller/status.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',                //get all Status
    basicAuthUser,
    getAllStatus
);

router.get('/getSingleStatus',
    basicAuthUser,
    checkQuery('_id'),
    getSingleStatus,
);


router.post('/',
    basicAuthUser,
    createStatus
);


router.put('/',                    // update status
    basicAuthUser,
    checkQuery('_id'),
    updateStatus
);


router.delete('/',                  //delete Status
    basicAuthUser,
    checkQuery('_id'),
    deleteStatus
);


router.put('/getFilterStatus',
    basicAuthUser,
    getFilteredStatus,
);


export default router