// 'use strict';

// const mongoose = require('mongoose');
// require('dotenv').config();

// const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_lv0';

// const mongooseOptions = {
//     serverSelectionTimeoutMS: 5000,
//     connectTimeoutMS: 10000,
//     autoIndex: false,
// };

// mongoose.connect(mongoURI, mongooseOptions)
//     .then(() => {
//         console.log('Connected to MongoDB:', mongoURI);
//     })
//     .catch(err => {
//         console.error('Failed to connect to MongoDB', err);
//         process.exit(1);
//     });

// mongoose.connection.on('error', err => {
//     console.error('MongoDB connection error:', err);
// });

// module.exports = mongoose;