
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/reviews');

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
    try {
        const allProducts = await Product.find().sort({totalRating: -1});

        res.status(200).json(allProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


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

router.put('/update/product/discount', async(req, res) => {
    const {productId, discount} = req.body;

    if(!productId){
        return res.status(404).json({error: 'product id is required !'});
    }

    if (!discount || typeof discount !== 'number' || discount <= 0) {
        return res.status(400).json({ error: 'Invalid discount value!' });
    }

    try{
        const updatedProduct = await Product.findByIdAndUpdate({_id: productId}, {discount: discount}, {new: true});

        if(!updatedProduct){
            return res.status(404).json({ error: 'cannot find that product!' });
        }

        res.status(200).json({ message: 'discount updated successfully!', product: updatedProduct });
        
    }catch(err){
        res.status(500).json({error: err});
    }
})

router.put('/update/product/endOfDiscounts', async(req, res) => {
    const {id, endOfDiscount} = req.body;
    
    try{
        const updatedProduct = await Product.findOneAndUpdate(
            {_id: id},
            {endOfDiscount: endOfDiscount}
        )
        res.status(200).json({message: 'time updated successfuly !', updatedProduct});
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put('/update/product/startOfDiscount', async(req, res) => {
    const {id, startOfDiscount} = req.body;
    
    try{
        const updatedProduct = await Product.findOneAndUpdate(
            {_id: id},
            {startOfDiscount: startOfDiscount}
        )
        res.status(200).json({message: 'time updated successfuly !', updatedProduct});
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put('/update/product/discountSticker', async(req, res) => {
    const {productId, discountSticker} = req.body;

    if(!productId){
        return res.status(404).json({error: 'product id is required !'});
    }

    if (!discountSticker || typeof discountSticker !== 'string' ) {
        return res.status(400).json({ error: 'Invalid discountSticker value!' });
    }

    try{
        const updatedProduct = await Product.findByIdAndUpdate({_id: productId}, {discountSticker: discountSticker}, {new: true});

        if(!updatedProduct){
            return res.status(404).json({ error: 'cannot find that product!' });
        }

        res.status(200).json({ message: 'discountSticker updated successfully!', product: updatedProduct });
        
    }catch(err){
        res.status(500).json({error: err});
    }
})


module.exports = router;


