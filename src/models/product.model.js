'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_description: { type: String},
    product_price: { type: Number, required: true },
    product_thumb: { type: String, required: true },
    product_quanlity: { type: Number, required: true},
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Other'] },
    product_shop : String,
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true }
},
{
    timestamps: true,
    collection: COLLECTION_NAME
}
)

const clothingSchema = new mongoose.Schema({
    size: { type: String },
    material: { type: String },
    brand: { type: String }
}, { collection: 'clothes', timestamps: true });

const electronicSchema = new mongoose.Schema({
    model: { type: String },
    color: { type: String },
    manufactory: { type: String }
}, { collection: 'electronics', timestamps: true });

module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronic: mongoose.model('Electronic', electronicSchema)
}

