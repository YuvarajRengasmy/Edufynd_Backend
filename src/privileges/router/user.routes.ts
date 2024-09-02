import {Router} from 'express';
import {createUser, assignPrivileges} from '../controller/user.controller';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';
const router:Router=Router();




router.post('/', createUser);


router.post('/privileges', assignPrivileges);


export default router