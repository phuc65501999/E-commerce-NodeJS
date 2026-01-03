'use strict';

const apiKeyModel = require('../models/apiKey.model');
const crypto = require('crypto');

const findById = async ( key ) => {
    // const newKey = await apiKeyModel.create({
    //     key : crypto.randomBytes(16).toString('hex'),
    //     permissions : ['READ','WRITE','DELETE'],
    //     status : true,
    // });
    // console.log('newKey: ', newKey);
    const cleanKey = (key || '').toString().replace(/^['\"]|['\"]$/g, '').trim();
    const objKey = await apiKeyModel.findOne({ key: cleanKey, status: true }).lean();
    return objKey;
}

module.exports = { findById };