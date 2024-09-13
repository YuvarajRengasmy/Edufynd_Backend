import { Router } from 'express';
import { getAllTraining, getSingleTraining, createTraining, updateTraining, deleteTraining, getFilteredTraining } from './training.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession, checkPermission} from '../utils/tokenManager';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    checkSession,
    getAllTraining
);

router.get('/getSingleTraining',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleTraining,
);


router.post('/',
    basicAuthUser,
    checkSession,
    createTraining
);


router.put('/',                   
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    updateTraining
);


router.delete('/',                  
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteTraining
);

router.put('/getFilterTraining',
    basicAuthUser,
    checkSession,
    getFilteredTraining,
);

export default router