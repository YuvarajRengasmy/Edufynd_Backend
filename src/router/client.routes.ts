import { Router } from 'express';
import { getAllClient, getSingleClient, saveClient, updateClient, deleteClient, csvToJson, getFilteredClient } from '../controller/client.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
const router: Router = Router();


router.get('/',                //get all client
    basicAuthUser,
    checkSession,
    getAllClient
);

router.get('/getSingleClient',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleClient,
);


router.post('/',
    basicAuthUser,
    checkSession,
    saveClient
);


router.put('/',                    // update 
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateClient
);


router.delete('/',                  //delete client
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    deleteClient
);



router.put('/getFilterClient',
    basicAuthUser,
    checkSession,
    getFilteredClient,
);

router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);

export default router