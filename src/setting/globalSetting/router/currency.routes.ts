import { Router } from 'express';
import { getAllCurrency, getSingleCurrency, createCurrency, deleteCurrency, getFilteredCurrency } from '../../globalSetting/controller/currency.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',                //get all Currency
    basicAuthUser,
    getAllCurrency
);

router.get('/getSingleCurrency',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCurrency,
);


router.post('/',
    basicAuthUser,
    createCurrency
);


router.delete('/',               
    basicAuthUser,
    checkQuery('_id'),
    deleteCurrency
);

router.put('/getFilterCurrency',
    basicAuthUser,
    getFilteredCurrency,
);


export default router