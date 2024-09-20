import {Router} from 'express';
import {getAllProgram, getSingleProgram, createProgram,updateProgram, deleteProgram, 
    getFilteredProgram, getFilteredProgramForAppliedStudent, csvToJson, getProgramUniversity,
    getAllProgramForWeb, getProgramsByUniversityName, getProgramDetailsByUniversity,
    updateProgramApplications,getProgramByCountry,getProgramByUniversity,
    getProgramCategory, getAllProgramCard,
    getAllLoggedProgram,
    getSingleLoggedProgram} from '../controller/program.controller';
import { checkQuery, checkRequestBodyParams} from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';

const router:Router=Router();

router.get('/', 
    basicAuthUser,
    checkSession,
    checkPermission('program', 'view'),
    getAllProgram
);


router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedProgram
);


router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedProgram,
);

router.get('/card', 
    basicAuthUser,
    checkSession,
    checkPermission('program', 'view'),
    getAllProgramCard
);

router.get('/getSingleProgram',
    basicAuthUser,
    checkSession,
    checkPermission('program', 'view'),
    checkQuery('_id'),
    getSingleProgram,
);

router.post('/', 
        basicAuthUser,
        checkSession,
        checkPermission('program', 'add'),
        createProgram
);


router.put('/',            
    basicAuthUser,
    checkSession,
    checkPermission('program', 'edit'),
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateProgram
);


router.delete('/',            
    basicAuthUser,
    checkSession,
    checkPermission('program', 'delete'),
    checkQuery('_id'),
    deleteProgram
);

router.get('/getAllProgramForWeb',       
    basicAuthUser,
    checkSession,
    getAllProgramForWeb
);


router.put('/getUniversityFilterProgram',
    basicAuthUser,
    checkSession,
    checkPermission('program', 'view'),
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

router.get('/getProgramByCountry',
    basicAuthUser,
    getProgramByCountry
)
router.get('/getProgramByUniversity',
    basicAuthUser,
    getProgramByUniversity
)

router.put('/applyStudent',
basicAuthUser,
updateProgramApplications
)

router.get('/getProgramUniversity',
    basicAuthUser,
    // checkQuery('universityId'),
    getProgramUniversity,
);

router.get('/getProgramCategory',
    basicAuthUser,
    checkQuery('popularCategories'),
    getProgramCategory,
)


/// Public API
router.get('/public', getAllProgram);

router.get('/publicGetSingleProgram',checkQuery('_id'),getSingleProgram);

router.get('/publicGetAllProgramForWeb',getAllProgramForWeb);

router.put('/publicGetUniversityFilterProgram',getFilteredProgram);

router.get('/publicGetProgramByUniversity',checkQuery('universityId'),getProgramsByUniversityName);

router.get('/publicGetProgramUniversity',checkQuery('universityId'),getProgramUniversity);



export default router