import { Router } from 'express';
import { getAllFlightTicketEnquiry, getSingleFlightTicketEnquiry, createFlightTicketEnquiry, updateFlightTicketEnquiry, deleteFlightTicketEnquiry, getFilteredFlightTicketEnquiry } from '../controller/flightTicket.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession, checkPermission } from '../../utils/tokenManager';

const router: Router = Router();



router.get('/',
    basicAuthUser,
    checkSession,
    checkPermission('flightticket', 'view'),
    getAllFlightTicketEnquiry
);


router.get('/getSingleFlightEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('flightticket', 'view'),
    checkQuery('_id'),
    getSingleFlightTicketEnquiry,
);

router.post('/',
    checkPermission('flightticket', 'add'),
    checkRequestBodyParams('email'),
    createFlightTicketEnquiry
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkPermission('flightticket', 'edit'),
    checkRequestBodyParams('_id'),
    updateFlightTicketEnquiry,

);


router.delete('/',
    basicAuthUser,
    checkSession,
    checkPermission('flightticket', 'delete'),
    checkQuery('_id'),
    deleteFlightTicketEnquiry
);


router.put('/getFilterFlightEnquiry',
    basicAuthUser,
    checkSession,
    checkPermission('flightticket', 'view'),
    getFilteredFlightTicketEnquiry,
);



export default router