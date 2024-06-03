import {Router} from 'express';
import { createAgent,createStudentByAgent, getAllAgent, getFiltered, getSingleAgent, updateAgent } from '../controller/agent.controller';
import { createContact} from '../controller/contact.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.post('/', 
         checkRequestBodyParams('email'),
         createAgent
);

router.get('/getAll', //get all agent
    basicAuthUser,
     checkSession,
    getAllAgent
);

router.get('/getSingle',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleAgent,
);


router.post('/contact',
 createContact
);



router.put('/createStudent',             //create student by agent
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    createStudentByAgent  
);


router.put('/',                           //update agent
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateAgent  
);


router.put('/getFilter',
    basicAuthUser,
    checkSession,
    getFiltered,
);


export default router