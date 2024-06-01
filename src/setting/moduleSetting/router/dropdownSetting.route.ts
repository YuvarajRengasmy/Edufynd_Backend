import { Router } from 'express';
import { getAllUniversityList, getSingleUniversityList, createUniversityList, updateUniversityList, deleteUniversityList } from '../../moduleSetting/controller/dropdownSetting.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/getAllList',                //get all UniversityList
    basicAuthUser,
    getAllUniversityList
);

router.get('/getSingleList',
    basicAuthUser,
    checkQuery('_id'),
    getSingleUniversityList,
);


router.post('/',
    basicAuthUser,
    createUniversityList
);


router.put('/',                    // update UniversityList for Drop Down menu
    basicAuthUser,
    checkQuery('_id'),
    updateUniversityList
);


router.delete('/',                  //delete UniversityList for Drop down menu
    basicAuthUser,
    checkQuery('_id'),
    deleteUniversityList
);



export default router