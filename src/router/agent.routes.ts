import { Router } from 'express';
import { createAgent, createStudentProfileByAgent, csvToJson, deleteAgent, deleteStudentByAgent,
     editStudentProfileByAgent, getAllAgent, getFilteredStudentByAgent, getSingleAgent,
      updateAgent,createAgentBySuperAdmin, viewStudentProfileByAgent, getFilteredAgent,
      getAllLoggedAgent,
      getSingleLoggedAgent,
      activeAgent,
      deactivateAgent,
      assignStaffId} from '../controller/agent.controller';
import { createContact } from '../controller/contact.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser, validateAgentId,} from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
const router: Router = Router();


router.get('/',                                
    basicAuthUser,
    checkSession,
    checkPermission('agent', 'view'),
    getAllAgent
);


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedAgent
);


router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedAgent,
);

router.get('/getSingleAgent',
    basicAuthUser,
    checkSession,
    checkPermission('agent', 'view'),
    checkQuery('_id'),
    getSingleAgent,
);


router.post('/',
    basicAuthUser,
    checkSession,
    checkPermission('agent', 'add'),
    checkRequestBodyParams('email'),
    createAgent
);

router.post('/register',
    
    checkRequestBodyParams('email'),
    createAgent
);


router.post('/contact',
    createContact
);


router.put('/',                          
    basicAuthUser,
    checkSession,
    checkPermission('agent', 'edit'),
    checkRequestBodyParams('_id'),
    updateAgent
);


router.post('/activeAgent',
    basicAuthUser,
    checkSession,
    activeAgent
);

router.post('/deActiveAgent',
    basicAuthUser,
    checkSession,
    deactivateAgent
);


router.post('/assign', 
    basicAuthUser,
    checkSession,
    assignStaffId
)

router.delete('/',                 
    basicAuthUser,
    checkSession,
    checkPermission('agent', 'delete'),
    checkQuery('_id'),
    deleteAgent
);

router.put('/getFilterAgent',
    basicAuthUser,
     checkSession,
     checkPermission('agent', 'view'),
    getFilteredAgent,
);

router.post('/createAgentBySuperAdmin',             //create agent by super Admin
    basicAuthUser,
    checkSession,
    checkPermission('agent', 'add'),
    // checkQuery('_id'),
    createAgentBySuperAdmin
);

router.put('/getFilterStudentByAgent',
    basicAuthUser,
     checkSession,
     checkPermission('agent', 'view'),
    getFilteredStudentByAgent,
);

router.get('/viewStudentByAgent',             //View student by agent
    basicAuthUser,
    checkSession,
    // validateAgentId,
    checkQuery('studentId'),
    viewStudentProfileByAgent
);

router.post('/createStudentByAgent',             //create student by agent
    basicAuthUser,
    checkSession,
    // validateAgentId,
    createStudentProfileByAgent
);

router.put('/updateStudentByAgent',             //Update student by agent
    basicAuthUser,
    checkSession,
    // validateAgentId,
    editStudentProfileByAgent
);

router.delete('/deleteStudentByAgent',             //Delete student by agent
    basicAuthUser,
    checkSession,
    // validateAgentId,
    deleteStudentByAgent
);


router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);


export default router