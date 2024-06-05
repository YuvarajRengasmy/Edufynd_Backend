import { Router } from 'express';
import { getAllUniversity, getSingleUniversity, saveUniversity, updateUniversity, deleteUniversity, getFilteredUniversity,
     csvToJson, getFilteredUniversityForAgent, getFilteredUniversityForStudent, getAllUniversityForWeb, 
     getUniversityWithProgramDetails} from '../controller/university.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
import { University, UniversityDocument } from '../model/university.model'
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



// router.post('/',
//     basicAuthUser,
//     checkSession,
//     upload.fields([
//         { name: 'logo', maxCount: 1 },
//         { name: 'banner', maxCount: 1 }
//     ]),
//     saveUniversity
// );


router.post('/',
    basicAuthUser,
    checkSession,
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



router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);

////////


router.get('/getprogrambyuniversity',    /// Get university details with that university program          
    checkQuery('universityId'),
    getUniversityWithProgramDetails  
);




// router.post('/image', async(req,res)=>{
//     const {base64} = req.body
//     console.log(base64)
//     try {
//         await University.create({universityLogo: base64})
//         res.send({status:"ok", })
        
//     } catch (error) {
//         res.send({status: "error", data:error})
//     }
// })
export default router