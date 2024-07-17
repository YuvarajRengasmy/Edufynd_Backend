import {Router} from 'express';
import {getAllProgram, getSingleProgram, createProgram,updateProgram, deleteProgram, 
    getFilteredProgram, getFilteredProgramForAppliedStudent, csvToJson, 
    getAllProgramForWeb, getProgramsByUniversityName, getProgramDetailsByUniversity,
    updateProgramApplications} from '../controller/program.controller';
import { checkQuery, checkRequestBodyParams} from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';

const router:Router=Router();

router.get('/', 
    basicAuthUser,
    checkSession,
    getAllProgram
);

router.get('/getSingleProgram',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleProgram,
);

router.post('/', 
        basicAuthUser,
        checkSession,
        createProgram
);


router.put('/',            
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateProgram
);


router.delete('/',            
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteProgram
);

router.get('/getAllProgramForWeb',         // get all program for web //without checking session
    basicAuthUser,
     checkSession,
    getAllProgramForWeb
);


router.put('/getUniversityFilterProgram',
    basicAuthUser,
    checkSession,
    getFilteredProgram,
);


router.put('/appliedStudent',    // Filter for Applied Student of University
    basicAuthUser,
    checkSession,
    getFilteredProgramForAppliedStudent,
);


router.post('/import',      // CSV File to json and Store into Database
    upload.single('program'),
    csvToJson
);

router.get('/getProgramByUniversity',    /// Get university details with that university program          
    checkQuery('universityId'),
    getProgramsByUniversityName   
);


router.get('/programDetails',    /// Get program details with that university program          
    basicAuthUser,
    getProgramDetailsByUniversity   
);



router.put('/applyStudent',
basicAuthUser,
updateProgramApplications
)

export default router