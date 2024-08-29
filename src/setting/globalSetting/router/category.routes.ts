import { Router } from 'express';
import { getAllCategory, getSingleCategory, createCategory, 
    updateCategory, deleteCategory, getFilteredCategory } from '../../globalSetting/controller/category.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllCategory
);

router.get('/getSingleCategory',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCategory,
);


router.post('/',
    basicAuthUser,
    createCategory
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateCategory
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteCategory
);


router.put('/getFilterCategory',
    basicAuthUser,
    getFilteredCategory,
);



export default router