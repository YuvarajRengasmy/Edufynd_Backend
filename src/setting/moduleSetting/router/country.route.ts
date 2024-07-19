import { Router } from 'express';
import { getAllCountry , getSingleCountry , createCountry , updateCountry , deleteCountry , getFilteredCountry } from '../../moduleSetting/controller/country.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';

const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllCountry 
);
router.get('/getSingleCountryList',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCountry ,
);
router.post('/',
    basicAuthUser,
    createCountry 
);
router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateCountry 
);
router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteCountry 
);
router.put('/getFilterCountryList',
    basicAuthUser,
    getFilteredCountry ,
);



export default router