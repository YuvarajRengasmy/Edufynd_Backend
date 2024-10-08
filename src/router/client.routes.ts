import { Router } from 'express';
import {
    getAllClient, activeClient, getSingleClient, saveClient, updateClient, deleteClient,
    csvToJson, getFilteredClient, editClientProfileBySuperAdmin,getAllLoggedClient,
    getSingleLoggedClient,
    deactivateClient
} from '../controller/client.controller';
import { getAllClientCardDetails} from '../cards/clientCard.controller'
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission } from '../utils/tokenManager';
import upload from '../utils/fileUploaded';

const router: Router = Router();


router.get('/',
    basicAuthUser,
    checkSession,
    getAllClient
);

router.get('/logs',
    basicAuthUser,
    checkSession,
    getAllLoggedClient
);

router.get('/SingleLog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLoggedClient,
);

router.get('/card',
    basicAuthUser,
    checkSession,
    getAllClientCardDetails
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


router.post('/activeClient',
    basicAuthUser,
    checkSession,
    activeClient
);

router.post('/deActiveClient',
    basicAuthUser,
    checkSession,
    deactivateClient
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
    getFilteredClient,
);

router.post('/import',      // CSV File to json and Store into Database
    upload.single('file'),
    csvToJson
);

export default router