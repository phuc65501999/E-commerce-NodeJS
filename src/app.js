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
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        code : 500,
        message : 'Internal Server Error',
        status : 'failed'
    });
});


module.exports = app;