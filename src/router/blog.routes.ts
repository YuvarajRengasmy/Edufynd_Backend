import {Router} from 'express';
import {getAllBlog, getSingleBlog, saveBlog, updateBlog,deleteBlog} from '../blogs/blogs.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.get('/',               //get all Blog
    basicAuthUser,
     checkSession,
     getAllBlog
);


router.get('/getSingleBlog',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleBlog,
);


router.put('/', 
         basicAuthUser,
        //  checkSession,
        saveBlog
);


router.put('/',                    // update Blog
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    // checkRequestBodyParams('_id'),
    updateBlog
);


router.delete('/',                  //delete Blog
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteBlog
);


;

export default router