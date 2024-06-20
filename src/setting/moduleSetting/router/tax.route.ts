import { Router } from 'express';
import { getAllTax, getSingleTax, createTax, updateTax, deleteTax, getFilteredTax } from '../../moduleSetting/controller/tax.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllTax
);

router.get('/getSingleTax',
    basicAuthUser,
    checkQuery('_id'),
    getSingleTax,
);


router.post('/',
    basicAuthUser,
    createTax
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateTax
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteTax
);


router.put('/getFilterTax',
    basicAuthUser,
    getFilteredTax,
);



export default router