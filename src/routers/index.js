'use strict';

const express = require('express');

const router = express.Router();

router.use('/v1/api', require('./access/index'));

// router.get('', (req, res) => {
//   res.send('Welcome to the API');
// });
module.exports = router;