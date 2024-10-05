import { Router } from 'express';
import { getAllUniversity, getSingleUniversity, saveUniversity, updateUniversity, deleteUniversity, getFilteredUniversity,
     csvToJson, getFilteredUniversityForAgent, getFilteredUniversityForStudent, getAllUniversityForWeb, 
     getUniversityWithProgramDetails, getUniversityByCountry, getUniversityByName,
     getAllLoggedUniversity,
     getSingleLoggedUniversity,
     activeUniversity,
     deactivateUniversity,
    } from '../controller/university.controller';
import { getAllUniversit} from '../cards/universityCard.controller'
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
const router: Router = Router();


router.get('/',             
    basicAuthUser,
    checkSession,
    checkPermission('university', 'view'),
    getAllUniversity
);

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedUniversity
);


router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedUniversity,
);


router.get('/card',             
    // basicAuthUser,
    // checkSession,
    getAllUniversit
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
    checkPermission('university', 'add'),
    saveUniversity
);



router.put('/',                   
    basicAuthUser,
     checkSession,
    // checkQuery('_id'),
    checkPermission('university', 'edit'),
     checkRequestBodyParams('_id'),
    updateUniversity
);

router.post('/activeUniversity',
    basicAuthUser,
    checkSession,
    checkPermission('university', 'view'),
    activeUniversity
);

router.post('/deActiveUniversity',
    basicAuthUser,
    checkSession,
    deactivateUniversity
);


router.delete('/',                 
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    checkPermission('university', 'delete'),
    deleteUniversity
);


router.put('/getFilterUniversity',
    basicAuthUser,
    checkSession,
    // checkPermission('university', 'view'),
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