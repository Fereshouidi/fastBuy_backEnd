const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const ShoppingCart = require('../models/shoppingCart');
const Customer = require('../models/customer');


router.post('/add/order', async(req, res) => {

    const orderData = req.body;

    try {
        const newOrder = await new Order(orderData);
        newOrder.save();
        
        await ShoppingCart.findOneAndDelete({_id: orderData._id});

        const customer = await Customer.findOneAndUpdate(
            {_id: orderData.customer},
            {ShoppingCart: null}
        );

    

        res.status(201).json(newOrder);

    }catch(err) {
        res.status(500).json({error : err.message})
    }
})






module.exports = router; 