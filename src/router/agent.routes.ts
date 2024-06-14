import { Router } from 'express';
import { createAgent, createStudentProfileByAgent, csvToJson, deleteAgent, deleteStudentByAgent, editStudentProfileByAgent, getAllAgent, getFilteredStudentByAgent, getSingleAgent, updateAgent, viewStudentProfileByAgent } from '../controller/agent.controller';
import { createContact } from '../controller/contact.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser, validateAgentId } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
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

router.get('/viewStudentByAgent',             //View student by agent
    basicAuthUser,
    checkSession,
    validateAgentId,
    checkQuery('studentId'),
    viewStudentProfileByAgent
);

router.post('/createStudentByAgent',             //create student by agent
    basicAuthUser,
    checkSession,
    validateAgentId,
    createStudentProfileByAgent
);

router.put('/updateStudentByAgent',             //Update student by agent
    basicAuthUser,
    checkSession,
    validateAgentId,
    editStudentProfileByAgent
);

router.delete('/deleteStudentByAgent',             //Delete student by agent
    basicAuthUser,
    checkSession,
    validateAgentId,
    deleteStudentByAgent
);


router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);


export default router