import { Router } from 'express';
import { getAllTraining, getSingleTraining, createTraining, updateTraining, deleteTraining, getFilteredTraining } from './training.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllTraining
);

router.get('/getSingleTraining',
    basicAuthUser,
    checkQuery('_id'),
    getSingleTraining,
);


router.post('/',
    basicAuthUser,
    createTraining
);


router.put('/',                   
    basicAuthUser,
    checkQuery('_id'),
    updateTraining
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteTraining
);

router.put('/getFilterTraining',
    basicAuthUser,
    getFilteredTraining,
);

export default router