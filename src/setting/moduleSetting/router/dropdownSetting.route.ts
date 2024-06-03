import { Router } from 'express';
import { getAllDropDownList, getSingleDropDownList, createCustomLabel, updateDropDownList, deleteDropDownList } from '../../moduleSetting/controller/dropdownSetting.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/all',               
    basicAuthUser,
    getAllDropDownList
);

router.get('/',
    basicAuthUser,
    checkQuery('_id'),
    getSingleDropDownList,
);


router.post('/',
    basicAuthUser,
    createCustomLabel
);


router.put('/',                  
    basicAuthUser,
    checkQuery('_id'),
    updateDropDownList
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteDropDownList
);



export default router