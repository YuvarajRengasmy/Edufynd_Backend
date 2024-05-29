import { Router } from 'express';
import { getAllUniversity, getSingleUniversity, saveUniversity, updateUniversity, deleteUniversity, getFilteredUniversity,
     csvToJson, getFilteredUniversityForAgent, getFilteredUniversityForStudent, getAllUniversityForWeb, 
     universityLogo, getUniversityWithProgramDetails} from '../controller/university.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
;
const router: Router = Router();



router.get('/getalluniversity',                //get all university
    basicAuthUser,
    checkSession,
    getAllUniversity
);


router.get('/getsingleuniversity',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleUniversity,
);


router.post('/',
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    // checkRequestBodyParams('_id'),
    saveUniversity
);


router.put('/',                    // update 
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateUniversity
);


router.delete('/',                  //delete university
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteUniversity
);


router.put('/getfilteruniversity',
    basicAuthUser,
    checkSession,
    getFilteredUniversity,
);

router.get('/getalluniversityforweb',         // get all university for web //without checking session
    basicAuthUser,
    getAllUniversityForWeb
);


router.put('/agentfilteruniversity',
    basicAuthUser,
    checkSession,
    getFilteredUniversityForAgent,
);


router.put('/studentfilteruniversity',
    basicAuthUser,
    // checkSession,
    getFilteredUniversityForStudent,
);


router.post('/logo',
    upload.single('logo'),
    universityLogo
);

router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);

////////


router.get('/getprogrambyuniversity',    /// Get university details with that university program          
    checkQuery('universityId'),
    getUniversityWithProgramDetails  
);

export default router