import { Router } from 'express';
import { getAllEmailTemplate, getSingleTemplate, createEmailTemplate, updateTemplate, deleteTemplate, getFilteredEmail, getAllLoggedEmail, getSingleLoggedEmail } from '../../globalSetting/controller/email.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',           
    basicAuthUser,
    getAllEmailTemplate
);

router.get('/getSingleCountry',
    basicAuthUser,
    checkQuery('_id'),
    getSingleTemplate,
);

router.get('/logs',             
    basicAuthUser,
    getAllLoggedEmail
);


router.get('/SingleLog',
    basicAuthUser,
    checkQuery('_id'),
    getSingleLoggedEmail
);


router.post('/',
    basicAuthUser,
    createEmailTemplate
);


router.put('/',                   
    basicAuthUser,
    checkQuery('_id'),
    updateTemplate
);


router.delete('/',                
    basicAuthUser,
    checkQuery('_id'),
    deleteTemplate
);

router.put('/getFilterEmail',
    basicAuthUser,
    getFilteredEmail,
);

export default router