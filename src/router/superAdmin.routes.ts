import {Router} from 'express';
import {createSuperAdmin,getNotificationSearch, getFilteredSuperAdmin,getSuperAdminForSearch,getCommonSearch, getSingleSuperAdmin, getAllSuperAdmin, activeSuperAdmin, deactivateSuperAdmin, assignStaffId} from '../controller/superAdmin.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();



router.get('/',                        
    basicAuthUser,
     checkSession,
    getAllSuperAdmin
);

router.get('/getSingleSuperAdmin',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleSuperAdmin,
);

router.post('/', 
         checkRequestBodyParams('email'),
         createSuperAdmin
);




router.put('/getFilterSuperAdmin',
    basicAuthUser,
    checkSession,
    getFilteredSuperAdmin,
);

router.get('/getSuperAdminForSearch',
    basicAuthUser,
    checkSession,
    getSuperAdminForSearch);

router.get('/getCommonSearch',
        basicAuthUser,
        checkSession,
        getCommonSearch);

router.get('/getNotificationsSearch',
            basicAuthUser,
            checkSession,
     getNotificationSearch) ;

router.get('/publicGetSuperAdminForSearch',getSuperAdminForSearch);
 


router.post('/activeSuperAdmin',
        basicAuthUser,
        checkSession,
        activeSuperAdmin
    );
    
router.post('/deActiveSuperAdmin',
        basicAuthUser,
        checkSession,
        deactivateSuperAdmin
    );

router.post('/assign', 
        basicAuthUser,
        checkSession,
        assignStaffId
)

    
export default router