import { Router } from 'express';
import {getAllDemo, getSingleDemo, createDemo, updateDemo, deleteDemo, getFilteredDemo, getCountryByState, getAllCities } from '../controller/demo.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';

const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllDemo
);
router.get('/getSingleDemo',
    basicAuthUser,
    checkQuery('_id'),
    getSingleDemo ,
);
router.post('/',
    basicAuthUser,
    createDemo 
);
router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateDemo 
);
router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteDemo 
);
router.put('/getFilterDemo',
    basicAuthUser,
    getFilteredDemo ,
);


router.get('/getCountryByState',
    basicAuthUser,
    getCountryByState
)


// router.get('/getCountryByStateAndCity',
//     basicAuthUser,
//     getCountryByStateAndCity
// )

router.get('/getAllCities',
    basicAuthUser,
    getAllCities
)




export default router