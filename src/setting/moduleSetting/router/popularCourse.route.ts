import { Router } from 'express';
import { getAllPopularCategory, getSinglePopularCategory, createPopularCategory, updatePopularCategory, deletePopularCategory, getFilteredPopularCategory } from '../../moduleSetting/controller/popularCourse.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllPopularCategory
);

router.get('/getSinglePopularCategory',
    basicAuthUser,
    checkQuery('_id'),
    getSinglePopularCategory,
);


router.post('/',
    basicAuthUser,
    createPopularCategory
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updatePopularCategory
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deletePopularCategory
);


router.put('/getFilterPopularCategory',
    basicAuthUser,
    getFilteredPopularCategory,
);



export default router