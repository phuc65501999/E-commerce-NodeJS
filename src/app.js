const express = require('express');
const morgan = require('morgan');
const { default: helmet} = require('helmet');
const compression = require('compression');
const app = express();


// init middleware
app.use(morgan('dev'));
// morgan("combined")
app.use(helmet());

app.use(compression());
// init db
// require('./dbs/init.mongodb.lv0');
require('./dbs/init.mongodb');

const { checkOverLoad } = require('./helpers/check.connect');
checkOverLoad();




// init routes
app.get('/', (req, res) => {
    const strCompress = 'Welcome to the E-commerce API';
    return res.status(200).json({
        message: 'Welcome to the E-commerce API',
        metadata: strCompress.repeat(10000)
    });
});



// handle errors



module.exports = app;