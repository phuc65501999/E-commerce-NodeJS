'use strict';

const {product, clothing, electronic} = require('../models/product.model');

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
}

class Product {
    constructor({name, description, price, type, thumb, quantity,shop, attributes}) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.type = type;
        this.thumb = thumb;
        this.quantity = quantity;
        this.shop = shop;
        this.attributes = attributes;
    }

    async createProduct() {
        return await product.create(this);
    }
}

// defined sub class 

class Clothing extends Product {
    constructor({name, description, price, type, thumb, quantity, shop, attributes}) {
        super({name, description, price, type, thumb, quantity, shop, attributes});
        this.size = attributes.size;
        this.material = attributes.material;
    }   
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
    constructor({name, description, price, type, thumb, quantity, shop, attributes}) {
        super({name, description, price, type, thumb, quantity, shop, attributes});
        this.brand = attributes.brand;
        this.model = attributes.model;
    }   
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