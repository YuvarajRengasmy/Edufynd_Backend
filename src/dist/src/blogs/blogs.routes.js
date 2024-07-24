"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogs_controller_1 = require("../blogs/blogs.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, 
//  checkSession,
blogs_controller_1.getAllBlog);
router.get('/getSingleBlog', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), blogs_controller_1.getSingleBlog);
router.put('/', checkAuth_1.basicAuthUser, 
//  checkSession,
blogs_controller_1.saveBlog);
router.put('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), 
// checkRequestBodyParams('_id'),
blogs_controller_1.updateBlog);
router.delete('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), blogs_controller_1.deleteBlog);
;
exports.default = router;
//# sourceMappingURL=blogs.routes.js.map