const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');
const Customer = require('../models/customer');
const Product = require('../models/product');
const ShoppingCart = require('../models/shoppingCart');


router.post('/add/purchase', async(req, res) => {
    const purchase_data = req.body;
    
    try{
        const newPurchase = new Purchase(purchase_data);
        await newPurchase.save();

        const customer = await Customer.findByIdAndUpdate(
            {_id: purchase_data.buyer},
            {$push: {purchases: newPurchase._id}},
            {new: true}
        );


        await Product.findOneAndUpdate(
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

            await Customer.findByIdAndUpdate(
                {_id: purchase_data.buyer},
                {ShoppingCarts: newShoppingCart._id},
                {new: true}
            );
        }

        

        res.status(201).json({message: 'purchase added successfully !', newPurchase})
    }catch(err){
        res.status(500).json({error: err.message});
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

router.delete('/delete/purchase/byId', async (req, res) => {
    const { id } = req.query;

    console.log(id);
    
    try {
        const purchase = await Purchase.findOne({ _id: id });
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        const customer = await Customer.findByIdAndUpdate(
            purchase.buyer,
            { $pull: { purchases: purchase._id } },
            { new: true }
        );
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const product = await Product.findByIdAndUpdate(
            purchase.product,
            { $pull: { inPurchases: purchase._id } },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await ShoppingCart.findOneAndUpdate(
            { customer: customer._id },
            {
                $pull: { purchases: purchase._id, products: purchase.product },
                $set: { lastUpdate: new Date() },
            },
            { new: true }
        );

        await Purchase.findByIdAndDelete(id);

        res.status(200).json({ message: 'Purchase deleted successfully!', customer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;

