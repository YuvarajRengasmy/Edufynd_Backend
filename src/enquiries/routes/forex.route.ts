import {Router} from 'express';
import { getAllForexEnquiry,getSingleForexEnquiry, createForexEnquiry,updateForexEnquiry, deleteForexEnquiry,getFilteredForexEnquiry} from '../controller/forex.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
      checkSession,
    getAllForexEnquiry
);


router.get('/getSingleForexEnquiry',
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    getSingleForexEnquiry,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createForexEnquiry
);

router.put('/',          
    basicAuthUser,
     checkSession,
    checkRequestBodyParams('_id'),
    updateForexEnquiry,
 
);


router.delete('/',               
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    deleteForexEnquiry
);


router.put('/getFilterForex',
    basicAuthUser,
     checkSession,
    getFilteredForexEnquiry,
);



export default router