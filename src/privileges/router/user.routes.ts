import {Router} from 'express';
import { assignPermissions} from '../../utils/tokenManager';
import { checkQuery, checkRequestBodyParams } from '../../middleware/Validators';
import { basicAuthUser } from '../../middleware/checkAuth';
import { checkSession } from '../../utils/tokenManager';
const router:Router=Router();






router.post('/privileges', assignPermissions);


export default router