import { Router } from 'express';
import { getAllApplicationStatus, getSingleApplicationStatus, createApplicationStatus, updateApplicationStatus,
     deleteApplicationStatus,
     getFilteredApplicationStatus } from '../../moduleSetting/controller/businessEnquiryStatus.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',              
    basicAuthUser,
    getAllApplicationStatus
);

router.get('/getSingleBusinessStatus',
    basicAuthUser,
    checkQuery('_id'),
    getSingleApplicationStatus,
);


router.post('/',
    basicAuthUser,
    createApplicationStatus
);


router.put('/',                   
    basicAuthUser,
    //  checkQuery('_id'),
    updateApplicationStatus
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteApplicationStatus
);


router.put('/getFilterBusinessStatus',
    basicAuthUser,
    getFilteredApplicationStatus,
);


export default router