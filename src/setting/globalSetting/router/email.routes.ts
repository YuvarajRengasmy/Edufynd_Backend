import { Router } from 'express';
import { getAllEmailTemplate, getSingleTemplate, createEmailTemplate, updateTemplate, deleteTemplate, getFilteredEmail } from '../../globalSetting/controller/email.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/getAllCountry',                //get all Email Template
    basicAuthUser,
    getAllEmailTemplate
);

router.get('/getSingleCountry',
    basicAuthUser,
    checkQuery('_id'),
    getSingleTemplate,
);


router.post('/',
    basicAuthUser,
    createEmailTemplate
);


router.put('/',                    // update Template
    basicAuthUser,
    checkQuery('_id'),
    updateTemplate
);


router.delete('/',                  //delete Template
    basicAuthUser,
    checkQuery('_id'),
    deleteTemplate
);

router.put('/getFilterEmail',
    basicAuthUser,
    getFilteredEmail,
);

export default router