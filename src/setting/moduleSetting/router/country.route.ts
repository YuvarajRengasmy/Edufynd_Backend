import { Router } from 'express';
import { getAllCountryList , getSingleCountryList , createCountryList , updateCountryList , deleteCountryList , getFilteredCountryList,
     getCountryByState,getCountryByStateAndCity, getAllCities } from '../../moduleSetting/controller/country.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';

const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllCountryList
);
router.get('/getSingleCountryList',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCountryList ,
);
router.post('/',
    basicAuthUser,
    createCountryList 
);
router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateCountryList 
);
router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteCountryList 
);
router.put('/getFilterCountryList',
    basicAuthUser,
    getFilteredCountryList ,
);


router.get('/getCountryByState',
    basicAuthUser,
    getCountryByState
)


router.get('/getCountryByStateAndCity',
    basicAuthUser,
    getCountryByStateAndCity
)

router.get('/getAllCities',
    basicAuthUser,
    getAllCities
)




export default router