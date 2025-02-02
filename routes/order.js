const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const ShoppingCart = require('../models/shoppingCart');
const Purchase = require('../models/purchase');
const Customer = require('../models/customer');
const Product = require('../models/product');

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

        await Purchase.updateMany(
            { _id: { $in: orderData.purchases } },
            { status: 'processing' }
        );
        
        for (const purchase of orderData.purchases) {
            
            await Product.updateOne(
                { _id: purchase.product._id },
                { 
                    $inc: { quantity: -purchase.quantity },
                    $pull: { inPurchases: { $in: orderData.purchases } } 
                }
            );     
        }
        

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
        res.status(500).json({error : err.message});
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
            
        ]).sort({createdAt: -1})
        
        
        res.status(201).json(orders);

    }catch(err) {
        res.status(500).json({error : err.message})
        console.log(err);
        
    }
})

router.get('/gt/allOrders', async(req, res) => {
    
    try {
        
        const orders = await Order.find().populate([
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
            
        ])
        
        
        res.status(201).json(orders);

    }catch(err) {
        res.status(500).json({error : err.message})
        console.log(err);
        
    }
})

router.put('/update/order/status', async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;

        if (!orderId || !newStatus) {
            return res.status(400).json({ error: "Missing orderId or newStatus" });
        }

        const order = await Order.findById(orderId).populate([
            { path: 'purchases', populate: { path: 'product', populate: { path: 'categorie' } } },
            { path: 'products' },
            { path: 'customer' }
        ]);

        if (!order) {
            return res.status(404).json({ error: "Order not found!" });
        }

        if (order.status === 'delivered' || order.status === 'failed') {
            return res.status(400).json({ error: "This status can't be changed!" });
        }


        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true }
        ).populate([
            { path: 'purchases', populate: { path: 'product', populate: { path: 'categorie' } } },
            { path: 'products' },
            { path: 'customer' }
        ]);

        if (!updatedOrder) {
            return res.status(500).json({ error: "Order update failed!" });
        }
        

        if (updatedOrder.status === 'delivered') {
            await Promise.all(
                order.purchases.map(async (purchase) => {
                    try {
                        if (purchase.product && purchase.product._id) {
                            await Product.findByIdAndUpdate(
                                purchase.product._id,
                                { $addToSet: { buyers: order.buyer } },
                                { new: true }
                            );
                        }
                    } catch (err) {
                        console.error(" Error updating product buyers:", err);
                    }
                })
            );
        }

        if (updatedOrder.status === 'failed') {
            for (const purchase of updatedOrder.purchases) {
                const product = await Product.findOneAndUpdate(
                    { _id: purchase.product._id },
                    { $inc: { quantity: purchase.quantity } },
                    { new: true }
                );
                console.log(product);
                
            }
        }
        

        await Promise.all(
            order.purchases.map(async (purchase) => {
                try {
                    if (purchase._id) {
                        await Purchase.findByIdAndUpdate(
                            purchase._id,
                            { status: newStatus },
                            { new: true }
                        );
                    }
                } catch (err) {
                    console.error(" Error updating purchase status:", err);
                }
            })
        );

        console.log(order);
        
        res.status(200).json(updatedOrder);

    } catch (err) {
        console.error(" Server error:", err);
        res.status(500).json({ error: err.message });
    }
});






module.exports = router; 