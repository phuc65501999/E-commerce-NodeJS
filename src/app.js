const express = require('express');
const morgan = require('morgan');
const { default: helmet} = require('helmet');
const compression = require('compression');
const app = express();


// init middleware
app.use(morgan('dev'));
// morgan("combined")
app.use(helmet());

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
// init db
// require('./dbs/init.mongodb.lv0');
require('./dbs/init.mongodb');

const { checkOverLoad } = require('./helpers/check.connect');
checkOverLoad();




// init routes
app.use('/', require('./routers/index'));



// handle errors



module.exports = app;