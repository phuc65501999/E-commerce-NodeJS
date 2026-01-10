'use strict';

const express = require('express');
const ProductController = require('../../controllers/product.controller');
const router = express.Router();
const {authentication, authenticationV2} = require('../../auth/authUtils');
// public routes (no authentication)

router.use(authenticationV2);

router.post('/', ProductController.createProduct);

// query products draft
router.get('/drafts/all', ProductController.getProductsDraft);


module.exports = router;