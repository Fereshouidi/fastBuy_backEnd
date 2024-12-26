const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/shoppingCart');
const Product = require('../models/product');
const Purchase = require('../models/purchase');
const { populate } = require('../models/companyInformations');



router.put('/update/shoppingCart/status', async(req, res) => {
    const { id, status } = req.body;
    try{

        const shoppingCart = await ShoppingCart.findById(id);

        if(!shoppingCart){
            return res.status(404).json({error: 'shopping cart not found !'})
        }

        if(
            (shoppingCart.status == 'cart' || shoppingCart.status == 'processing')
            && status == 'delivered'
        ){

            const updatedShoppingCart = await ShoppingCart.findByIdAndUpdate(
                {_id: id},
                {status: status},
                {new: true}
            ) 
            await Promise.all(
                updatedShoppingCart.products.map(async(productId) => {
                    await Product.findOneAndUpdate({_id: productId}, {$push: {buyers: updatedShoppingCart.customer}}, {new: true});
                }),
                updatedShoppingCart.purchases.map(async(purchaseId) => {
                    await Purchase.findOneAndUpdate({_id: purchaseId}, {status: status}, {new: true});
                })
            )
            
            return res.status(200).json({message: 'purchaseCart updated successfully !', updatedShoppingCart});


        }else if(status == 'canceled' || status == 'payment_failed' || status == 'returned' || status == 'out_of_stock'){

            const updatedShoppingCart = await ShoppingCart.findByIdAndUpdate(
                {_id: id},
                {status: status},
                {new: true}
            ) 

            for (const purchase_id of updatedShoppingCart.purchases) {
                for (const product_id of updatedShoppingCart.products) {
                    await Product.findOneAndUpdate(
                        { _id: product_id },
                        { $pull: { inPurchases: purchase_id } },
                        { new: true }
                    );
                }
            }
            return res.status(200).json({message: 'purchaseCart updated successfully !', updatedShoppingCart});

        }


        res.status(200).json({error : `the status cannot be transformed from '${shoppingCart.status}' to '${status}' `});

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/allShoppingCarts', async(req, res) => {
    try{
        const allShoppingCarts = await ShoppingCart.find();
        res.status(200).json(allShoppingCarts);
    }catch{
        res.status(500).json({error: err});
    }
})

router.get('/get/activeShoppingCart/by/customer', async (req, res) => {
    const {customerId} = req.query;

    try {
        const shoppingCarts = await ShoppingCart.find({
            customer: customerId,
        }).populate({
            path: 'purchases',
            populate: {
                path: 'product',
                populate: [
                    { path: 'discount' },
                    { path: 'discountCode' },
                ],
            },
        });
        

        if (!shoppingCarts) {
            return res.status(404).json({ error: "Shopping cart not found" });
        }

        res.status(200).json(shoppingCarts);
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal server error" });
        //console.log(err);
        
    }
});


module.exports = router;