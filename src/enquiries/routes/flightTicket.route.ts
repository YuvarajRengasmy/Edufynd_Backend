import {Router} from 'express';
import { getAllFlightTicketEnquiry,getSingleFlightTicketEnquiry, createFlightTicketEnquiry,updateFlightTicketEnquiry, deleteFlightTicketEnquiry,getFilteredFlightTicketEnquiry} from '../controller/flightTicket.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';

const router:Router=Router();



router.get('/',                          
    basicAuthUser,
    //  checkSession,
    getAllFlightTicketEnquiry
);


router.get('/getSingleFlightEnquiry',
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    getSingleFlightTicketEnquiry,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createFlightTicketEnquiry
);

router.put('/',          
    basicAuthUser,
    // checkSession,
    checkRequestBodyParams('_id'),
    updateFlightTicketEnquiry,
 
);


router.delete('/',               
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    deleteFlightTicketEnquiry
);


router.put('/getFilterFlightEnquiry',
    basicAuthUser,
    // checkSession,
    getFilteredFlightTicketEnquiry,
);



export default router