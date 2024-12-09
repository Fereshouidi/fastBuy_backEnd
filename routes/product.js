
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/reviews');
const Discount = require('../models/discount');
const { propfind } = require('./customer');

router.post('/add/Product', async(req, res) => {
    const data = req.body;
    try{
        const newProduct = await new Product(data);
        await newProduct.save();
        res.status(201).json(newProduct);
    }catch(err){
        res.status(500).json({error: err});
    }
})

router.get('/get/allProducts', async(req, res) => {
    try{
        const allProducts = await Product.find();
        res.status(200).json(allProducts);
    }catch{
        res.status(500).json({error: err});
    }
})

router.get('/get/product/byId/:id', async(req, res) => {
    const id = req.params.id;
    
    try{
        const product = await Product.findById(id);

        if(product){
            res.status(200).json(product);
        }else{
            res.status(404).json({error: 'product not found !'})
        }

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/products/byRating', async (req, res) => {
    const {page, limit} = req.query;
    const skip = (page - 1) * limit;
    try {
        const allProducts = await Product.find().sort({ totalRating: -1 }).limit(parseInt(limit)).skip(parseInt(skip));

        const productIds = allProducts.map(product => product._id);

        const discounts = await Discount.find({ productId: { $in: productIds } });

        const discountMap = discounts.reduce((map, discount) => {
            map[discount.productId] = discount;
            return map;
        }, {});

        const productsWithDiscounts = allProducts.map(product => {
            const productObj = product.toObject(); 
            productObj.discount = discountMap[product._id] || null; 
            return productObj;
        });

        res.status(200).json(productsWithDiscounts);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/product/categorie', async(req, res) => {
    const {productId, categorieId} = req.body;

    if(!productId){
        return res.status(404).json({error: 'product id is required !'});
    }

    if (!categorieId) {
        return res.status(404).json({ error: 'categorie not found !' });
    }

    try{
        const updatedProduct = await Product.findByIdAndUpdate({_id: productId}, {categorie: categorieId}, {new: true});

        if(!updatedProduct){
            return res.status(404).json({ error: 'cannot find that product!' });
        }

        res.status(200).json({ message: 'Price updated successfully!', product: updatedProduct });
        
    }catch(err){
        res.status(500).json({error: err});
    }
})

router.put('/update/product/price', async(req, res) => {
    const {productId, newPrice} = req.body;

    if(!productId){
        return res.status(404).json({error: 'product id is required !'});
    }

    if (!newPrice || typeof newPrice !== 'number' || newPrice <= 0) {
        return res.status(400).json({ error: 'Invalid price value!' });
    }

    try{
        const updatedProduct = await Product.findByIdAndUpdate({_id: productId}, {price: newPrice}, {new: true});

        if(!updatedProduct){
            return res.status(404).json({ error: 'cannot find that product!' });
        }

        res.status(200).json({ message: 'Price updated successfully!', product: updatedProduct });
        
    }catch(err){
        res.status(500).json({error: err});
    }
})


module.exports = router;


