import { Router } from 'express';
import { getAllClient,activeClient, getSingleClient, saveClient, updateClient, deleteClient, csvToJson, getFilteredClient, editClientProfileBySuperAdmin, getAllClientCardDetails, getAllLoggedClient } from '../controller/client.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';

const router: Router = Router();


router.get('/',                
    basicAuthUser,
    checkSession,
    checkPermission('client', 'view'),
    getAllClient
);

router.get('/logs',             
    basicAuthUser,
    checkSession,
    getAllLoggedClient
);

router.get('/card', 
    basicAuthUser,
    checkSession,
    checkPermission('client', 'view'),
    getAllClientCardDetails
);

router.get('/getSingleClient',
    basicAuthUser,
    checkSession,
    checkPermission('client', 'view'),
    checkQuery('_id'),
    getSingleClient,
);


router.post('/',
    basicAuthUser,
    checkSession,
    checkPermission('client', 'add'),
    saveClient
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    checkPermission('client', 'edit'),
    // checkQuery('_id'),
     checkRequestBodyParams('_id'),
    updateClient
);


router.put('/activeClient',                
    basicAuthUser,
     checkSession,
    checkRequestBodyParams('_id'),
    activeClient
);

router.put('/editClientProfileBySuperAdmin',             //Update client by super Admin
    basicAuthUser,
    checkSession,
    editClientProfileBySuperAdmin
);

router.delete('/',                
    basicAuthUser,
     checkSession,
     checkPermission('client', 'delete'),
    checkQuery('_id'),
    deleteClient
);



router.put('/getFilterClient',
    basicAuthUser,
    checkSession,
    checkPermission('client', 'view'),
    getFilteredClient,
);

router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);

export default router