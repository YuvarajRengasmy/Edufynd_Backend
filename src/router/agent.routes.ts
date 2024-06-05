import { Router } from 'express';
import { createAgent, createStudentByAgent, createStudentProfileByAgent, deleteAgent, getAllAgent, getFilteredStudentByAgent, getSingleAgent, updateAgent } from '../controller/agent.controller';
import { createContact } from '../controller/contact.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser, validateAgentId } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router: Router = Router();



router.get('/',                                //get all agent
    basicAuthUser,
    checkSession,
    getAllAgent
);

router.get('/getSingleAgent',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleAgent,
);


router.post('/',
    basicAuthUser,
    checkRequestBodyParams('email'),
    createAgent
);


router.post('/contact',
    createContact
);



router.put('/createStudent',             //create student by agent
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    createStudentByAgent
);


router.put('/',                          //update agent
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateAgent
);


router.delete('/',                  //delete agent
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteAgent
);

router.put('/getFilterStudentByAgent',
    basicAuthUser,
    checkSession,
    getFilteredStudentByAgent,
);


router.post('/create',             //create student by agent
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    validateAgentId,
    createStudentProfileByAgent
);

export default router