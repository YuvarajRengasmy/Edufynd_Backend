import {Router} from 'express';
import { createAgent,createStudentByAgent, getAllAgent, getSingleAgent, updateAgent } from '../controller/agent.controller';
import { createContact} from '../controller/contact.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.post('/', 
         checkRequestBodyParams('email'),
         createAgent
);

router.get('/get', //get all agent
    basicAuthUser,
     checkSession,
    getAllAgent
);

router.get('/getsingleagent',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleAgent,
);


router.post('/contact',
 createContact
);



router.put('/create-student', //create student by agent
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    createStudentByAgent  
);


router.put('/update', //update agent
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateAgent  
);

export default router