import { Router } from 'express';
import { getAllStatus, getSingleStatus, createStatus, updateStatus, deleteStatus, getFilteredStatus, getAllLoggedStatus, getSingleLoggedStatus } from '../../globalSetting/controller/status.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',              
    basicAuthUser,
    getAllStatus
);

router.get('/getSingleStatus',
    basicAuthUser,
    checkQuery('_id'),
    getSingleStatus,
);

router.get('/logs',             
    basicAuthUser,
    getAllLoggedStatus
);


router.get('/SingleLog',
    basicAuthUser,
    checkQuery('_id'),
    getSingleLoggedStatus
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