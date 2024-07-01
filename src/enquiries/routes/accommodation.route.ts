import {Router} from 'express';
import { getAllAccommodation, getSingleAccommodation, createAccommodation, updateAccommodation, deleteAccommodationEnquiry, getFilteredAccommodation} from '../controller/accommodation.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
    //  checkSession,
    getAllAccommodation
);


router.get('/getSingleAccommodation',
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    getSingleAccommodation,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createAccommodation
);

router.put('/',             
    basicAuthUser,
    // checkSession,
    checkRequestBodyParams('_id'),
    updateAccommodation,
 
);


router.delete('/',                
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    deleteAccommodationEnquiry
);


router.put('/getFilterAccommodation',
    basicAuthUser,
    // checkSession,
    getFilteredAccommodation,
);



export default router