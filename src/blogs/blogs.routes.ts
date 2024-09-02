import {Router} from 'express';
import {getAllBlog, getSingleBlog, saveBlog, updateBlog,deleteBlog} from '../blogs/blogs.controller';
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
    // checkSession,
    checkQuery('_id'),
    getSingleBlog,
);


router.post('/', 
         basicAuthUser,
        checkSession,
        saveBlog
);


router.put('/',                   
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    // checkRequestBodyParams('_id'),
    updateBlog
);


router.delete('/',                  
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    deleteBlog
);


router.get('/publicBlog', getAllBlog);

router.get('/publicGetSingleBlog',checkQuery('_id'), getSingleBlog);



export default router