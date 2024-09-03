import { Router } from 'express';
import { getAllUniversity, getSingleUniversity, saveUniversity, updateUniversity, deleteUniversity, getFilteredUniversity,
     csvToJson, getFilteredUniversityForAgent, getFilteredUniversityForStudent, getAllUniversityForWeb, 
     getUniversityWithProgramDetails, getUniversityByCountry, getUniversityByName} from '../controller/university.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';

import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
import { checkPermission } from '../privileges/middleware/permission';
const router: Router = Router();


router.get('/',             
    basicAuthUser,
    checkSession,
    // checkPermission,
    getAllUniversity
);


router.get('/getSingleUniversity',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleUniversity,
);



router.post('/',
    basicAuthUser,
    checkSession,
    saveUniversity
);



router.put('/',                   
    basicAuthUser,
    // checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateUniversity
);


router.delete('/',                 
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    deleteUniversity
);


router.put('/getFilterUniversity',
    basicAuthUser,
    checkSession,
    // checkPermission,
    getFilteredUniversity,
);

router.get('/getAllUniversityForWeb',         
    basicAuthUser,
    // checkSession,
    getAllUniversityForWeb
);


router.put('/agentFilterUniversity',
    basicAuthUser,
    checkSession,
    getFilteredUniversityForAgent,
);


router.put('/studentFilterUniversity',
    basicAuthUser,
    checkSession,
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



router.get('/getUniversityByName',
    basicAuthUser,
    getUniversityByName
)



//Public API

router.get('/public',  getAllUniversity);

router.get('/publicGetSingleUniversity',checkQuery('_id'), getSingleUniversity);

router.put('/publicGetFilterUniversity', getFilteredUniversity);

router.get('/publicGetAllUniversityForWeb',getAllUniversityForWeb);

export default router