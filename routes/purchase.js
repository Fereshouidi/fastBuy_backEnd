const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');
const Customer = require('../models/customer');
const Product = require('../models/product');
const ShoppingCart = require('../models/shoppingCart');


router.post('/add/purchase', async(req, res) => {
    const purchase_data = req.body;

    console.log(purchase_data);
    
    try{
        const newPurchase = new Purchase(purchase_data);
        await newPurchase.save();

        const customer = await Customer.findByIdAndUpdate(
            {_id: purchase_data.buyer},
            {$push: {purchases: newPurchase._id}},
            {new: true}
        );

        await Product.findByIdAndUpdate(
            {_id: purchase_data.product},
            {$push: {inPurchases: newPurchase._id}},
        )

        const shoppingCart = await ShoppingCart.find(
            {customer: customer._id, status: 'cart'}
        )
        
        if(shoppingCart.length == 1){
            await ShoppingCart.findByIdAndUpdate(
                {_id: shoppingCart[0]._id},
                {$push: {purchases: newPurchase, products: newPurchase.product}, lastUpdate: new Date},
                {new: true}
            )
        }else{
            const newShoppingCart = await new ShoppingCart({
                customer: customer._id,
                purchases: newPurchase,
                products: [ newPurchase.product]
            })
            await newShoppingCart.save();
        }

        res.status(201).json({message: 'purchase added successfully !', newPurchase})
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
        
    }
})

router.get('/get/allPurchases', async(req, res) => {
    try{
        const allPurchases = await Purchase.find();
        res.status(200).json(allPurchases);
    }catch{
        res.status(500).json({error: err});
    }
})




module.exports = router;

