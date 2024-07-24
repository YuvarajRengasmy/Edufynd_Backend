import { Router } from 'express';
import { getAllCountry , getSingleCountry , createCountry , updateCountry , deleteCountry , getFilteredCountry,
     getCountryByState,getCountryByStateAndCity, getAllCities } from '../../moduleSetting/controller/country.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';
import { checkSession } from '../../../utils/tokenManager';

const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkSession,
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


router.get('/getCountryByState',
    basicAuthUser,
    getCountryByState
)


router.get('/getCountryByStates',
    basicAuthUser,
    getCountryByStateAndCity
)

router.get('/getAllCities',
    basicAuthUser,
    getAllCities
)




export default router