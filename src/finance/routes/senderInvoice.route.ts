import {Router} from 'express';
import { getAllSenderInvoice, getSingleSenderInvoice,updateApplication, createSenderInvoice, updateSenderInvoice, deleteSenderInvoice, getFilteredSenderInvoice, } from '../controller/senderInvoice.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission} from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
      checkSession,
    getAllSenderInvoice
);


router.get('/getSingleSenderInvoice',
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    getSingleSenderInvoice,
);

router.post('/', 
         createSenderInvoice
);

router.put('/',             
    basicAuthUser,
     checkSession,
    checkRequestBodyParams('_id'),
    updateSenderInvoice,
 
);


router.delete('/',                
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteSenderInvoice
);


router.put('/getFilterSenderInvoice',
    basicAuthUser,
     checkSession,
    getFilteredSenderInvoice,
);


router.put('/status',                    
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateSenderInvoice
);

router.put('/updateApplication', // update Master education 
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateApplication);


export default router