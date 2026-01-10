'use strict';

const {product, clothing, electronic} = require('../product.model');

const findAllDraftForShop = async ({query, limit = 50, skip = 0}) => {
    return product.find(query).populate('product_shop', 'name email _id')
    .sort({updatedAt: -1}).skip(skip).limit(limit).lean();

};

module.exports = {
    findAllDraftForShop
};