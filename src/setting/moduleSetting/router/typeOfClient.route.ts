import { Router } from 'express';
import { getAllTypeOfClient, getSingleTypeOfClient, createTypeOfClient, updateTypeOfClient, deleteTypeOfClient, getFilteredTypeOfClient } from '../../moduleSetting/controller/typeOfClient.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllTypeOfClient
);

router.get('/getSingleTypeOfClient',
    basicAuthUser,
    checkQuery('_id'),
    getSingleTypeOfClient,
);


router.post('/',
    basicAuthUser,
    createTypeOfClient
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateTypeOfClient
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteTypeOfClient
);


router.put('/getFilterTypeOfClient',
    basicAuthUser,
    getFilteredTypeOfClient,
);



export default router