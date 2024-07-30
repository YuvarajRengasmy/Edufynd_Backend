import {Router} from 'express';
import { getAllGeneralEnquiry,getSingleGeneralEnquiry, createGeneralEnquiry,updateGeneralEnquiry, deleteGeneralEnquiry, getFilteredGeneralEnquiry} from '../controller/generalEnquiry.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
     checkSession,
    getAllGeneralEnquiry
);


router.get('/getSingleGeneralEnquiry',
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    getSingleGeneralEnquiry,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createGeneralEnquiry
);

router.put('/',          
    basicAuthUser,
     checkSession,
    checkRequestBodyParams('_id'),
    updateGeneralEnquiry,
 
);


router.delete('/',               
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    deleteGeneralEnquiry
);


router.put('/getFilterGeneralEnquiry',
    basicAuthUser,
     checkSession,
    getFilteredGeneralEnquiry,
);




export default router