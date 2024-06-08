import { Router } from 'express';
import { getAllInstitutionType, getSingleInstitutionType, createInstitutionType, updateInstitutionType, deleteInstitutionType, getFilteredInstitutionType } from '../../moduleSetting/controller/institutionType.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllInstitutionType
);

router.get('/getSingleInstitutionType',
    basicAuthUser,
    checkQuery('_id'),
    getSingleInstitutionType,
);


router.post('/',
    basicAuthUser,
    createInstitutionType
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateInstitutionType
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteInstitutionType
);


router.put('/getFilterInstitutionType',
    basicAuthUser,
    getFilteredInstitutionType,
);



export default router