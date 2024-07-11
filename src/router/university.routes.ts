import { Router } from 'express';
import { getAllUniversity, getSingleUniversity, saveUniversity, updateUniversity, deleteUniversity, getFilteredUniversity,
     csvToJson, getFilteredUniversityForAgent, getFilteredUniversityForStudent, getAllUniversityForWeb, 
     getUniversityWithProgramDetails, getUniversityByCountry} from '../controller/university.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';

import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
const router: Router = Router();


router.get('/',                //get all university
    basicAuthUser,
    // checkSession,
    getAllUniversity
);


router.get('/getSingleUniversity',
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    getSingleUniversity,
);



router.post('/',
    basicAuthUser,
    // checkSession,
    saveUniversity
);



router.put('/',                    // update 
    basicAuthUser,
    // checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateUniversity
);


router.delete('/',                  //delete university
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    deleteUniversity
);


router.put('/getFilterUniversity',
    basicAuthUser,
    // checkSession,
    getFilteredUniversity,
);

router.get('/getAllUniversityForWeb',         // get all university for web //without checking session
    basicAuthUser,
    getAllUniversityForWeb
);


router.put('/agentFilterUniversity',
    basicAuthUser,
    // checkSession,
    getFilteredUniversityForAgent,
);


router.put('/studentFilterUniversity',
    basicAuthUser,
    // checkSession,
    getFilteredUniversityForStudent,
);



router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);

////////


router.get('/getProgramByUniversity',    /// Get university details with that university program          
    checkQuery('universityId'),
    getUniversityWithProgramDetails
);


router.get('/getUniversityByCountry',
    basicAuthUser,
    getUniversityByCountry
)



// router.get('/universities/:clientName',
//      getUniversitiesByClient
//     );




export default router