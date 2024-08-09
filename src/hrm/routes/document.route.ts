import { Router } from 'express';
import { getAllDocument, getSingleDocument, createDocument, updateDocument, deleteDocument, 
    getFilteredDocument} from '../controller/document.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';


const router: Router = Router();

router.get('/',               
    basicAuthUser,
    getAllDocument
);

router.get('/getSingleDocument',
    basicAuthUser,
    checkQuery('_id'),
    getSingleDocument,
);


router.post('/',
    basicAuthUser,
    checkSession,
    createDocument
);


router.put('/',                    
    basicAuthUser,
    checkSession,
    // checkQuery('_id'),
    updateDocument
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteDocument
);

router.put('/getFilterDocument',
    basicAuthUser,
    getFilteredDocument,
);



export default router