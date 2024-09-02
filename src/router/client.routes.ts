import { Router } from 'express';
import { getAllClient, getSingleClient, saveClient, updateClient, deleteClient, csvToJson, getFilteredClient, editClientProfileBySuperAdmin } from '../controller/client.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';
import { checkPermission } from '../privileges/middleware/permission';
const router: Router = Router();


router.get('/',                
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
    // checkPermission,
    saveClient
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    checkRequestBodyParams('_id'),
    updateClient
);


router.put('/editClientProfileBySuperAdmin',             //Update client by super Admin
    basicAuthUser,
    checkSession,
    editClientProfileBySuperAdmin
);

router.delete('/',                
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