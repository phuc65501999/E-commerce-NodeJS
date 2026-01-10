'use strict';

const {product, clothing, electronic} = require('../models/product.model');

const productRepo = require('../models/repositories/product.repo');



class ProductFactory {

    static async createProduct(type, payload) {
        switch (type) {
            case 'clothing':
                const clothingProduct = new Clothing(payload);
                return await clothingProduct.createProduct();
            case 'electronic':
                const electronicProduct = new Electronic(payload);
                return await electronicProduct.createProduct();
            default:
                throw new Error(`Unknown product type: ${type}`);
        }
    }

    static async findAllDraftForShop(shopId, limit = 50, skip = 0) {
        const query = {product_shop: shopId, isDraft: true};
        return await productRepo.findAllDraftForShop({query, limit, skip});
    }
}

class Product {
    constructor(payload = {}) {
        const {
            product_name, product_description, product_price, product_type, product_thumb, product_quantity, product_shop, product_attributes,
            name, description, price, type, thumb, quantity, shop, attributes
        } = payload;

        this.product_name = product_name || name;
        this.product_description = product_description || description;
        this.product_price = product_price || price;
        this.product_type = product_type || type;
        this.product_thumb = product_thumb || thumb;
        this.product_quantity = product_quantity || quantity;
        this.product_shop = product_shop || shop;
        this.product_attributes = product_attributes || attributes;
    }

    async createProduct() {
        const doc = {
            product_name: this.product_name,
            product_description: this.product_description,
            product_price: this.product_price,
            product_type: this.product_type,
            product_thumb: this.product_thumb,
            product_quantity: this.product_quantity,
            product_shop: this.product_shop,
            product_attributes: this.product_attributes
        };
        return await product.create(doc);
    }
}

// defined sub class 

class Clothing extends Product {
    async createProduct() {
        const createdProduct = await clothing.create(this.attributes);
        if (!createdProduct) {
            throw new Error('Failed to create clothing attributes');
        }
        const newProduct = await super.createProduct();
        if (!newProduct) {
            throw new Error('Failed to create product');
        }
        return newProduct;
    }
}

class Electronic extends Product { 
    async createProduct() {
        const createdProduct = await super.createProduct();
        if (!createdProduct) {
            throw new Error('Failed to create product');
        }
        const createdElectronic = await electronic.create({productId: createdProduct.id, brand: this.brand, model: this.model});
        if (!createdElectronic) {
            throw new Error('Failed to create electronic attributes');
        }
        return createdProduct;
    }   
}

module.exports = ProductFactory;