import { Router } from 'express';
import { getAllQualification, getSingleQualification, createQualification, updateQualification, deleteQualification, 
    getFilteredQualification } from '../../moduleSetting/controller/qualification.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllQualification
);

router.get('/getSingleQualification',
    basicAuthUser,
    checkQuery('_id'),
    getSingleQualification,
);


router.post('/',
    basicAuthUser,
    createQualification
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateQualification
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteQualification
);


router.put('/getFilterQualification',
    basicAuthUser,
    getFilteredQualification,
);



export default router