import {Router} from 'express';
import { getAllAccommodation, getSingleAccommodation, createAccommodation, updateAccommodation, deleteAccommodationEnquiry, getFilteredAccommodation} from '../controller/accommodation.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
      checkSession,
      checkPermission('accommodation', 'view'),
    getAllAccommodation
);


router.get('/getSingleAccommodation',
    basicAuthUser,
     checkSession,
     checkPermission('accommodation', 'view'),
    checkQuery('_id'),
    getSingleAccommodation,
);

router.post('/', 
    checkPermission('accommodation', 'add'),
         checkRequestBodyParams('email'),
         createAccommodation
);

router.put('/',             
    basicAuthUser,
     checkSession,
     checkPermission('accommodation', 'edit'),
    checkRequestBodyParams('_id'),
    updateAccommodation,
 
);


router.delete('/',                
    basicAuthUser,
     checkSession,
     checkPermission('accommodation', 'delete'),
    checkQuery('_id'),
    deleteAccommodationEnquiry
);


router.put('/getFilterAccommodation',
    basicAuthUser,
     checkSession,
     checkPermission('accommodation', 'view'),
    getFilteredAccommodation,
);



export default router