'use strict';

const ProductService = require('../services/product.service');

class ProductController {
    createProduct = async (req, res, next) => {
        try {
            const {product_type, ...payload} = req.body;
            console.log('Creating product with type:', product_type, 'and payload:', payload);
            const newProduct = await ProductService.createProduct(product_type, payload);
            
            return res.status(201).json({data: newProduct, message: 'Product created successfully'});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    getProductsDraft = async (req, res, next) => {
        try {
            const products = await ProductService.findAllDraftForShop(req.user._id);
            console.log('Draft products for shop:', products);
            console.log('Draft products for shop req:', req.user);
            return res.status(200).json({data: products, message: 'Products retrieved successfully'});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports = new ProductController();