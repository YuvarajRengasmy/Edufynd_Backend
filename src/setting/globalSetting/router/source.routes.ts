import { Router } from 'express';
import { getAllSource, getSingleSource, createSource, updateSource, deleteSource, 
    getFilteredSource, 
    getAllLoggedSource,
    getSingleLoggedSource} from '../../globalSetting/controller/source.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';
import { checkSession } from '../../../utils/tokenManager';


const router: Router = Router();

router.get('/',              
    basicAuthUser,
    getAllSource
);

router.get('/getSingleSource',
    basicAuthUser,
    checkQuery('_id'),
    getSingleSource,
);


router.get('/logs',             
    basicAuthUser,
    getAllLoggedSource
);


router.get('/SingleLog',
    basicAuthUser,
    checkQuery('_id'),
    getSingleLoggedSource
);

router.post('/',
    basicAuthUser,
    checkSession,
    createSource
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    updateSource
);


router.delete('/',                 
    basicAuthUser,
    checkQuery('_id'),
    deleteSource
);


router.put('/getFilterSource',
    basicAuthUser,
    getFilteredSource,
);


export default router