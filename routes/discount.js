const express = require('express');
const router = express.Router();
const Discount = require('../models/discount');
const Product = require('../models/product');
const Slider = require('../models/slider');



router.post('/add/discount', async(req, res) => {
    const data = req.body;

    try{
        const product = await Product.findById(data.productId);
        if(!product.discount){
            const newDiscount = await new Discount(data);
            newDiscount.save();
            await Product.updateMany(
                {_id: {$in: data.productId}}, 
                {discount: newDiscount._id}
            )
            res.status(201).json(newDiscount);
        }else{
            res.status(400).json({error : 'This product already has a discount !'})
        }
        
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/discount/byId', async(req, res) => {
    const id = req.query;

    try{
       
        const discount = await Discount.findOne({_id: id});
        res.status(200).json(discount);
        
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.put('/update/discount/by/percentage', async(req, res) => {
    const {discountId, percentage} = req.body;

    if(!discountId){
        return res.status(404).json({error: 'product id is required !'});
    }

    if (!percentage || typeof percentage !== 'number' || percentage <= 0) {
        return res.status(400).json({ error: 'Invalid percentage value!' });
    }

    try{
        const Oldiscount = await Discount.findById(discountId);
        const updatedDiscount = await Discount.findByIdAndUpdate(
            {_id: discountId},
            {
                percentage: percentage , 
                newPrice: Oldiscount.oldPrice - ((percentage*100) / 100),
            },
            {new: true});


        if(!updatedDiscount){
            return res.status(404).json({ error: 'cannot find that product!' });
        }

        res.status(200).json({ message: 'discount updated successfully!', product: updatedDiscount });
        
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.put('/update/discount/by/id', async(req, res) => {
    const {id} = req.body;
    
    try{
        const discount = await Discount.findOne({_id: id});
        const product = await Product.findOne({_id: discount.productId});
        const updatingSlider = await Slider.findByIdAndUpdate(
            '674ce6fccefd08dd4b9b8a6b',
            { $pull: { products: product._id } },
            { new: true }
          );
          
        await Discount.findOneAndDelete({_id: id})

        res.status(200).json({message: 'discount deleted successfuly !', updatingSlider: updatingSlider});
    }catch(err){
        res.status(500).json({error: err.message})
    }
})


module.exports = router;