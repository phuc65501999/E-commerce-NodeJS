'use strict';

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
// sign up 
router.post('/shop/signup',AccessController.signUp);
// refresh token
router.post('/auth/refresh', AccessController.refresh);

module.exports = router;