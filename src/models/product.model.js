'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_slug: { type: String, unique: true },
    product_description: { type: String},
    product_price: { type: Number, required: true },
    product_thumb: { type: String, required: true },
    product_quantity: { type: Number, required: true},
    product_type: { type: String , enum: ['electronics', 'clothing', 'books', 'home', 'other'] },
    product_shop : { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    product_attributes: { type: mongoose.Schema.Types.Mixed},
    product_ratingsAverage: { type: Number, default: 4.5, min: 1, max: 5, set: val => Math.round(val * 10) / 10 },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
},
{
    timestamps: true,
    collection: COLLECTION_NAME
}
)

productSchema.pre('save', function() {
    if (this.product_name) {
        this.product_slug = slugify(this.product_name, { lower: true, strict: true });
    }
});

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

