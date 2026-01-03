'use strict';

const express = require('express');

const router = express.Router();

const apiKey = require('../auth/checkAuth').apiKey;
const per = require('../auth/checkAuth').checkPermission;

router.use(apiKey)

router.use(per('READ'));

router.use('/v1/api', require('./access/index'));

// router.get('', (req, res) => {
//   res.send('Welcome to the API');
// });
module.exports = router;