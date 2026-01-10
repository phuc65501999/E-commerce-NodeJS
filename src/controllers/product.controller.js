'use strict';

class ProductController {
    createProduct = async (req, res, next) => {
        try {
            const {type, ...payload} = req.body;
            const newProduct = await req.services.productService.ProductFactory.createProduct(type, payload);
            return res.status(201).json({data: newProduct, message: 'Product created successfully'});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports = new ProductController();