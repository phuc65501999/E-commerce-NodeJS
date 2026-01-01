'use strict';

// create connect to mongodb database singleton
const mongoose = require('mongoose');
require('dotenv').config();

const {checkConnections} = require('../helpers/check.connect');
let mongoURI = process.env.MONGO_URI;


if (!mongoURI) {
    console.error('Environment variable MONGO_URI is not set. Please provide a MongoDB connection string in MONGO_URI.');
    mongoURI = 'mongodb://appUser:strongPassword@localhost:27017/ecommerce_lv0?authSource=ecommerce_lv0'
}

const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    autoIndex: false,
}; 

class MongoDB {
    constructor() {
        if (!MongoDB.instance) {
            this._connect();
            MongoDB.instance = this;
        }
        return MongoDB.instance;

    }

    _connect() {
        mongoose.connect(mongoURI, mongooseOptions)
            .then(() => {

                
                checkConnections();
                console.log('Connected to MongoDB:', mongoURI);
            })
            .catch(err => {
                console.error('Failed to connect to MongoDB', err);
                process.exit(1);
            });
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });
    }
}

const instance = new MongoDB();
Object.freeze(instance); // prevent modification to the singleton instance

module.exports = instance;