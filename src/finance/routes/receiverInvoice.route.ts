import {Router} from 'express';
import { getAllReceiverInvoice, getSingleReceiverInvoice, createReceiverInvoice, updateReceiverInvoice, deleteReceiverInvoice, getFilteredReceiverInvoice} from '../controller/receiverInvoice.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
      checkSession,
    getAllReceiverInvoice
);


router.get('/getSingleReceiverInvoice',
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    getSingleReceiverInvoice,
);

router.post('/', 
         createReceiverInvoice
);

router.put('/',             
    basicAuthUser,
     checkSession,
    checkRequestBodyParams('_id'),
    updateReceiverInvoice,
 
);


router.delete('/',                
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    deleteReceiverInvoice
);


router.put('/getFilterSenderInvoice',
    basicAuthUser,
     checkSession,
    getFilteredReceiverInvoice,
);



export default router