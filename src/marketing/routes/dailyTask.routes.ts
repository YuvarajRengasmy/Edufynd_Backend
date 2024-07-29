import { Router } from 'express';
import { getAllDailyTask, getSingleDailyTask, createDailyTask, updateDailyTask,
     deleteDailyTask, getFilteredDailyTask } from '../controller/dailyTask.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllDailyTask
);

router.get('/getSingleDailyTask',
    basicAuthUser,
    checkQuery('_id'),
    getSingleDailyTask,
);


router.post('/',
    basicAuthUser,
    createDailyTask
);


router.put('/',                   
    basicAuthUser,
    checkQuery('_id'),
    updateDailyTask
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteDailyTask
);

router.put('/getFilterDailyTask',
    basicAuthUser,
    getFilteredDailyTask,
);

export default router