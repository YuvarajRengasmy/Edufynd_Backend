import {Router} from 'express';
import {getAllProgram, getSingleProgram, createProgram,updateProgram, deleteProgram, 
    getFilteredProgram, getFilteredProgramForAppliedStudent, csvToJson, 
    getAllProgramForWeb, getProgramsByUniversityName, getProgramDetailsByUniversity} from '../controller/program.controller';
import { checkQuery, checkRequestBodyParams} from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';

const router:Router=Router();

router.get('/getallprogram', //get all program
    basicAuthUser,
     checkSession,
    getAllProgram
);

router.get('/getsingleprogram',
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


router.put('/',            // update 
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateProgram
);


router.delete('/',             //delete program
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteProgram
);

router.get('/getallprogramforweb',         // get all program for web //without checking session
    basicAuthUser,
    getAllProgramForWeb
);


router.put('/getuniversityfilterprogram',
    basicAuthUser,
    checkSession,
    getFilteredProgram,
);


router.put('/appliedstudent',    // Filter for Applied Student of University
    basicAuthUser,
    checkSession,
    getFilteredProgramForAppliedStudent,
);


router.post('/import',      // CSV File to json and Store into Database
    upload.single('program'),
    csvToJson
);

router.get('/getprogrambyuniversity',    /// Get university details with that university program          
    checkQuery('universityId'),
    getProgramsByUniversityName   
);


router.get('/programDetails',    /// Get program details with that university program          
    basicAuthUser,
    getProgramDetailsByUniversity   
);


export default router