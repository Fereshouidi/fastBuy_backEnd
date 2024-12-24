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
        ).populate('purchases')
        
        
        const getTotalPrice = (shoppingCart) => {
            let totalPrice = 0;
            shoppingCart.purchases.forEach(purchase => {
                totalPrice = totalPrice + purchase.totalPrice
            });
            return totalPrice;
        }
        

        if(shoppingCart.length == 1){    

            await ShoppingCart.findByIdAndUpdate(
                {_id: shoppingCart[0]._id},
                {
                    $push: {purchases: newPurchase, products: newPurchase.product}, 
                    totalPrice : getTotalPrice(shoppingCart[0]) + newPurchase.totalPrice,
                    lastUpdate: new Date},
                {new: true}
            )

            await Purchase.findOneAndUpdate(
                {_id: newPurchase._id},
                {shoppingCart: shoppingCart[0]._id}
            )

        }else{

            const newShoppingCart = await new ShoppingCart({
                customer: customer._id,
                purchases: newPurchase,
                products: [ newPurchase.product]
            })
            await newShoppingCart.save();

            await Purchase.findOneAndUpdate(
                {_id: newPurchase._id},
                {shoppingCart: newShoppingCart._id}
            )

            await ShoppingCart.findByIdAndUpdate(
                {_id: newShoppingCart._id},
                {totalPrice : getTotalPrice(newShoppingCart)}
            )

            console.log('bech :' + purchase_data.buyer);
            
            await Customer.findByIdAndUpdate(
                {_id: purchase_data.buyer},
                {ShoppingCart: newShoppingCart._id},
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

        const getTotalPriceOfShoppingCart = (shoppingCart) => {
            let totalPrice = 0;
            shoppingCart.purchases.forEach(purchase => {
                totalPrice = totalPrice + purchase.totalPrice
            });
            return totalPrice;
        }

        const shoppingCart = await ShoppingCart.findOne(
            { customer: customer._id , 
                status: 'cart'
            }).populate('purchases')
            
        const updatedShoppingCart = await ShoppingCart.findOneAndUpdate(
            { _id: shoppingCart._id },
            {
                $pull: { purchases: purchase._id, products: purchase.product },
                $set: { lastUpdate: new Date() },
                totalPrice: getTotalPriceOfShoppingCart(shoppingCart) - purchase.totalPrice
            },
            { new: true }
        );
        console.log(updatedShoppingCart);


        await Purchase.findByIdAndDelete(id);

        res.status(200).json({ message: 'Purchase deleted successfully!', customer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/quantity', async (req, res) => {
    const { id, quantity } = req.body;
    
    if (!id || !quantity || isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const purchase = await Purchase.findOne({ _id: id }).populate({
            path: 'product',
            populate: 'discount'
        })
        
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }

        const productPrice = purchase.product && purchase.product.discount
            ? purchase.product.discount.newPrice
            : purchase.product ? purchase.product.price : 0;

        const totalPrice = productPrice * quantity;
        
        const updatedPurchase = await Purchase.findOneAndUpdate(
            { _id: id },
            { quantity, totalPrice },
            { new: true }
        );

        const getTotalPriceOfShoppingCart = (shoppingCart) => {
            let totalPrice = 0;
            shoppingCart.purchases.forEach(purchase => {
                totalPrice = totalPrice + purchase.totalPrice
            });
            return totalPrice;
        }

        const shoppingCart = await ShoppingCart.findOne({_id: updatedPurchase.shoppingCart}).populate('purchases')
        

        await ShoppingCart.findOneAndUpdate(

            {_id: shoppingCart._id},
            {
                totalPrice : getTotalPriceOfShoppingCart(shoppingCart),
                lastUpdate: new Date
            },
            {new: true}
        )

        res.status(200).json(updatedPurchase);

    } catch (err) {
        res.status(500).json({ error: err.message });      
        console.log(err);
          
    }
});



module.exports = router;

