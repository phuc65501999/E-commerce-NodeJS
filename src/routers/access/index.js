'use strict';

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const {authentication} = require('../../auth/authUtils');
// public routes (no authentication)
router.post('/shop/signup', AccessController.signUp);
router.post('/shop/login', AccessController.login);
router.post('/auth/refresh', AccessController.refresh);

// protected routes
router.use(authentication);
router.post('/shop/logout', AccessController.logout);

module.exports = router;