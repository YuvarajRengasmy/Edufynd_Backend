"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogs_controller_1 = require("../blogs/blogs.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.get('/', //get all Blog
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, blogs_controller_1.getAllBlog);
router.get('/getSingleBlog', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), blogs_controller_1.getSingleBlog);
router.put('/', checkAuth_1.basicAuthUser, 
//  checkSession,
blogs_controller_1.saveBlog);
router.put('/', // update Blog
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), 
// checkRequestBodyParams('_id'),
blogs_controller_1.updateBlog);
router.delete('/', //delete Blog
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), blogs_controller_1.deleteBlog);
;
exports.default = router;
//# sourceMappingURL=blog.routes.js.map