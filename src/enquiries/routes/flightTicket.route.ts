import { Router } from 'express';
import { getAllFlightTicketEnquiry, getSingleFlightTicketEnquiry, createFlightTicketEnquiry, updateFlightTicketEnquiry, deleteFlightTicketEnquiry, getFilteredFlightTicketEnquiry } from '../controller/flightTicket.controller';
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



export default router