import { Router } from 'express';
import { getAllFlightTicketEnquiry, getSingleFlightTicketEnquiry, createFlightTicketEnquiry, updateFlightTicketEnquiry, deleteFlightTicketEnquiry, getFilteredFlightTicketEnquiry, getAllLoggedFlight, getSingleLoggedFlight, activeFlight, deactivateFlight, assignStaffId, updateStatus } from '../controller/flightTicket.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('flightEnquiry', 'view'),
    getAllFlightTicketEnquiry
);


router.get('/getSingleFlightEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('flightEnquiry', 'view'),
    checkQuery('_id'),
    getSingleFlightTicketEnquiry,
);

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedFlight
);


router.get('/singleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedFlight
);


router.put('/status',                    
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateStatus
);

router.post('/',
    checkPermission('flightEnquiry', 'add'),
    checkRequestBodyParams('email'),
    createFlightTicketEnquiry
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('flightEnquiry', 'edit'),
    checkRequestBodyParams('_id'),
    updateFlightTicketEnquiry,

);

router.post('/active',
    basicAuthUser,
    checkSession,
    activeFlight
);

router.post('/deActive',
    basicAuthUser,
    checkSession,
    deactivateFlight
);

router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('flightEnquiry', 'delete'),
    checkQuery('_id'),
    deleteFlightTicketEnquiry
);


router.put('/getFilterFlightEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('flightEnquiry', 'view'),
    getFilteredFlightTicketEnquiry,
);

//Public API

router.get('/public', getAllFlightTicketEnquiry);

router.get('/publicGetSingleFlightEnquiry', getSingleFlightTicketEnquiry);

router.post('/public', createFlightTicketEnquiry);

export default router