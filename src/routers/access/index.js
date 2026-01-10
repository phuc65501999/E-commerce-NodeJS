'use strict';

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const {authentication, authenticationV2} = require('../../auth/authUtils');
// public routes (no authentication)
router.post('/shop/signup', AccessController.signUp);
router.post('/shop/login', AccessController.login);


// protected routes
router.use(authenticationV2);
router.post('/shop/logout', AccessController.logout);
router.post('/auth/refresh', AccessController.refresh);

module.exports = router;