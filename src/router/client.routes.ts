import { Router } from 'express';
import { getAllClient, getSingleClient, saveClient, updateClient, deleteClient } from '../controller/client.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';

const router: Router = Router();

router.get('/getallclient',                //get all client
    basicAuthUser,
    checkSession,
    getAllClient
);

router.get('/getsingleclient',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleClient,
);


router.post('/',
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    // checkRequestBodyParams('_id'),
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


export default router