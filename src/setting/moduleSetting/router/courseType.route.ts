import { Router } from 'express';
import { getAllCourseTypeList, getSingleCourseTypeList, createCourseType, updateCourseTypeList, deleteCourseType, getFilteredCourseType } from '../../moduleSetting/controller/courseType.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllCourseTypeList
);

router.get('/getSingleCourseType',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCourseTypeList,
);


router.post('/',
    basicAuthUser,
    createCourseType
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateCourseTypeList
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteCourseType
);


router.put('/getFilterCourseType',
    basicAuthUser,
    getFilteredCourseType,
);



export default router