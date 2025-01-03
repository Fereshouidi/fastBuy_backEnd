
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
        res.status(500).json({error: err.message});
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

router.get('/get/product/byId', async(req, res) => {
    const id = req.query.id;
    
    try{
        const product = await Product.findById(id).populate('discount').populate('categorie').populate('discountCode');

        if(product){
            res.status(200).json(product);
        }else{
            res.status(404).json({error: 'product not found !'})
        }

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/product/by/biggestDiscount', async(req, res) => {
    try{
        const discount = await Discount.find().sort({ percentage: -1 });

        if(discount[0]){
            const products = await Product.find({discount: discount[0]._id});
            res.status(200).json({discount: discount[0], products});
          //  console.log(discount[0].percentage);
            
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
        const allProducts = await Product.find().sort({ totalRating: -1 }).limit(parseInt(limit)).skip(parseInt(skip)).populate('discount');

        res.status(200).json(allProducts);

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


