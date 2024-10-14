import { Router } from 'express';
import { getAllAccommodation, getSingleAccommodation, createAccommodation, updateAccommodation, deleteAccommodationEnquiry, getFilteredAccommodation, getAllLoggedAccommodation, getSingleLoggedAccommodation, activeAccommodation, deactivateAccommodation, assignStaffId, updateAccommodationStatus } from '../controller/accommodation.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';
import { getAllAccommodationEnquiryCard } from '../../cards/accommodationCard.controller';

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

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedAccommodation
);


router.get('/singleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedAccommodation,
);

router.get('/card',
    basicAuthUser,
    checkSession,
    getAllAccommodationEnquiryCard
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

router.put('/status',
    basicAuthUser,
    checkSession,
    checkPermission('accommodationEnquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateAccommodationStatus,

);



router.post('/active',
    basicAuthUser,
    checkSession,
    activeAccommodation
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateAccommodation
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)


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

router.post('/public', createAccommodation);






export default router