import { Router } from 'express';
import { getAllAccommodation, getSingleAccommodation, createAccommodation, updateAccommodation, deleteAccommodationEnquiry, getFilteredAccommodation } from '../controller/accommodation.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('accommodationEnquiry', 'view'),
    getAllAccommodation
);


router.get('/getSingleAccommodation',
    basicAuthUser,
    checkSession,
    checkPermission('accommodationEnquiry', 'view'),
    checkQuery('_id'),
    getSingleAccommodation,
);

router.post('/',
    basicAuthUser,
    checkSession,
    checkPermission('accommodationEnquiry', 'add'),
    checkRequestBodyParams('email'),
    createAccommodation
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('accommodationEnquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateAccommodation,

);


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('accommodationEnquiry', 'delete'),
    checkQuery('_id'),
    deleteAccommodationEnquiry
);


router.put('/getFilterAccommodation',
    basicAuthUser,
    checkSession,
    checkPermission('accommodationEnquiry', 'view'),
    getFilteredAccommodation,
);



//Public API

router.get('/public', getAllAccommodation);

router.get('/publicGetSingleAccommodation', getSingleAccommodation);

router.post('/', createAccommodation);






export default router