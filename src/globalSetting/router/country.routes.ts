import { Router } from 'express';
import { getAllCountry, getSingleCountry, createCountry, updateCountry, deleteCountry } from '../../globalSetting/controller/country.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';


const router: Router = Router();

router.get('/getAllCountry',                //get all Country
    basicAuthUser,
    getAllCountry
);

router.get('/getSingleCountry',
    basicAuthUser,
    checkQuery('_id'),
    getSingleCountry,
);


router.post('/',
    basicAuthUser,
    createCountry
);


router.put('/',                    // update Country
    basicAuthUser,
    checkQuery('_id'),
    updateCountry
);


router.delete('/',                  //delete Country
    basicAuthUser,
    checkQuery('_id'),
    deleteCountry
);


export default router