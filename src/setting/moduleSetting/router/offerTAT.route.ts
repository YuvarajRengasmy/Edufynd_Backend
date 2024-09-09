import { Router } from 'express';
import { getAllOfferTAT, getSingleOfferTAT, createOfferTAT, updateOfferTAT, deleteOfferTAT, getFilteredOfferTAT } from '../../moduleSetting/controller/offerTAT.controller';
import { checkQuery, checkRequestBodyParams } from '../../../middleware/Validators';
import { basicAuthUser } from '../../../middleware/checkAuth';


const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllOfferTAT
);

router.get('/getSingleOfferTAT',
    basicAuthUser,
    checkQuery('_id'),
    getSingleOfferTAT,
);


router.post('/',
    basicAuthUser,
    createOfferTAT
);


router.put('/',
    basicAuthUser,
    checkQuery('_id'),
    updateOfferTAT
);


router.delete('/',
    basicAuthUser,
    checkQuery('_id'),
    deleteOfferTAT
);


router.put('/getFilterOfferTAT',
    basicAuthUser,
    getFilteredOfferTAT,
);



export default router