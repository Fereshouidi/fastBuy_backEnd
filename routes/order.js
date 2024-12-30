const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const ShoppingCart = require('../models/shoppingCart');
const Customer = require('../models/customer');
const { populate } = require('../models/companyInformations');


router.post('/add/order', async(req, res) => {

    const orderData = req.body;

    try {
        const newOrder = await new Order({
            ...orderData, 
            customer: orderData.customer._id,
            createdAt: new Date
        });
        newOrder.save();
    
        
        await ShoppingCart.findOneAndDelete({_id: orderData._id});

        const customer = await Customer.findOneAndUpdate(
            {_id: orderData.customer},
            {ShoppingCart: null}
        );

        if ( !customer.adress || !customer.phone ) {
            
            await Customer.findOneAndUpdate(
                {_id: orderData.customer},
                {   
                    adress: orderData.customer.adress ,
                    phone: orderData.customer.phone
                }
            );

        } 

        res.status(201).json(newOrder);

    }catch(err) {
        res.status(500).json({error : err.message})
    }
})

router.get('/gt/orders/byCustomer', async(req, res) => {

    const {customerId} = req.query;
    
    try {
        
        const orders = await Order.find({ customer: customerId }).populate([
            {
                path: 'purchases',
                populate: {
                    path: 'product',
                    populate: {
                        path: 'categorie'
                    }
                }
            }, {
                path: 'products'
            }, {
                path: 'customer',
            }
            
        ]);
        
        
        res.status(201).json(orders);

    }catch(err) {
        res.status(500).json({error : err.message})
        console.log(err);
        
    }
})






module.exports = router; 