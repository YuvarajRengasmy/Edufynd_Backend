import {Router} from 'express';
import {getAllBlog, getSingleBlog, saveBlog, updateBlog,deleteBlog, getFilteredBlog} from '../blogs/blogs.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.get('/',               
    basicAuthUser,
      checkSession,
     getAllBlog
);


router.get('/getSingleBlog',
    basicAuthUser,
     checkSession,
    checkRequestBodyParams('_id'),
    // checkQuery('_id'),
    getSingleBlog,
);


router.post('/', 
         basicAuthUser,
        checkSession,
        saveBlog
);


router.put('/',                   
    basicAuthUser,
     checkSession,
    
    updateBlog
);


router.delete('/',                  
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    deleteBlog
);

router.put('/getFilterBlog',
    basicAuthUser,
    checkSession,
    getFilteredBlog,
);


router.get('/publicBlog', getAllBlog);

router.get('/publicGetSingleBlog',checkQuery('_id'), getSingleBlog);
router.put('/publicGetFilterBlog', getFilteredBlog);


export default router