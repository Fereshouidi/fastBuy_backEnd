const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');
const Customer = require('../models/customer');
const Product = require('../models/product');
const ShoppingCart = require('../models/shoppingCart');
const CompanyInformations = require('../models/companyInformations');
const Order = require('../models/order'); 


router.post('/add/purchase', async(req, res) => {

    const purchase_data = req.body;    
    //console.log(purchase_data);
    

    if (!purchase_data.product) {
        return res.status(400).json({error: 'product id is necessary !'});
    }

    try{     
        const purchaseExistAlready = await Purchase.findOne({
            buyer: purchase_data.buyer,
            product: purchase_data.product,
            status: 'cart'        
        }); 

        if (purchaseExistAlready) {
            return ;
        }
        

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

        res.status(201).json({message: 'purchase added successfully !', newPurchase})
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
        
    }
})

router.post('/put/purchase/in/shoppingCart', async(req, res) => {
    const {purchaseId, customerId} = req.body;    
        
    try{   

        const purchase = await Purchase.findById(purchaseId);      
                
        const shoppingCart = await ShoppingCart.find(
            {customer: customerId, status: 'cart'}
        ).populate('purchases')
        
        
        const getTotalPrice = (shoppingCart) => {
            let totalPrice = 0;
            shoppingCart.purchases.forEach(purchase => {
                totalPrice = totalPrice + purchase.totalPrice
            });
            return totalPrice;
        }

        if(shoppingCart.length == 1){    
            
            if (shoppingCart[0].products.includes(purchase.product)){
                return res.status(210).json({message: 'purchase is already exist in shoppingCart !', });
            }

            await ShoppingCart.findByIdAndUpdate(
                {_id: shoppingCart[0]._id},
                {
                    $push: {purchases: purchase, products: purchase.product}, 
                    totalPrice : getTotalPrice(shoppingCart[0]) + purchase.totalPrice,
                    lastUpdate: new Date},
                {new: true}
            )

            const updatedPurchase = await Purchase.findOneAndUpdate(
                {_id: purchase._id},
                {
                    shoppingCart: shoppingCart[0]._id,
                    status: 'inShoppingCart',
                    putItInCart: new Date(),
                    new: true
                }
            )

        }else{

            const companyInformations = await CompanyInformations.find();

            const newShoppingCart = await new ShoppingCart({
                customer: customerId,
                purchases: purchase,
                products: [ purchase.product],
                shippingCost: companyInformations[0].shippingCost
            })
            await newShoppingCart.save();

            const updatedPurchase = await Purchase.findOneAndUpdate(
                {_id: purchase._id},
                {
                    shoppingCart: newShoppingCart._id,
                    status: 'inShoppingCart',
                    putItInCart: new Date(),
                    new: true
                }
            )

            await ShoppingCart.findByIdAndUpdate(
                {_id: newShoppingCart._id},
                {totalPrice : getTotalPrice(newShoppingCart)}
            )
            
            await Customer.findByIdAndUpdate(
                {_id: customerId},
                {ShoppingCart: newShoppingCart._id},
                {new: true}
            );

        }

        res.status(201).json({message: 'purchase added successfully !', purchase})
        
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
    }
})

router.post('/add/purchase/and/putItInShoppingCart', async(req, res) => {
    const purchase_data = req.body;    
    
    console.log(purchase_data);
    
    try{        

        // const purchaseExistAlready = await Purchase.findOne({
        //     buyer: purchase_data.buyer,
        //     product: purchase_data.product,
        //     status: 'cart'        
        // }); 

        // if (purchaseExistAlready) {
        //     return res.status(300).json({message: 'This purchase already exists!'});
        // }
        

        // const newPurchase = new Purchase(purchase_data);
        // await newPurchase.save();

        // const customer = await Customer.findByIdAndUpdate(
        //     {_id: purchase_data.buyer},
        //     {$push: {purchases: newPurchase._id}},
        //     {new: true}
        // );


        // await Product.findOneAndUpdate(
        //     {_id: purchase_data.product},
        //     {$push: {inPurchases: newPurchase._id}},
        // )

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

            const companyInformations = await CompanyInformations.find();

            const newShoppingCart = await new ShoppingCart({
                customer: customer._id,
                purchases: newPurchase,
                products: [ newPurchase.product],
                shippingCost: companyInformations[0].shippingCost
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
            
            await Customer.findByIdAndUpdate(
                {_id: purchase_data.buyer},
                {ShoppingCart: newShoppingCart._id},
                {new: true}
            );
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

// router.get('/get/reviews/by/product', async(req, res) => {

//     const {productId} = req.query;

//     try{
//         const purchases = await Purchase.find({product: productId}).populate('buyer');
//         const reviews = purchases.filter(purchases => purchases.customerNote)

//         res.status(200).json(reviews);
//     }catch (err){
//         res.status(500).json({error: err.message});
//     }
// })

router.get('/get/purchases/by/customer&product', async(req, res) => {
    const {customerId, productId} = req.query;
    try{
        const purchases = await Purchase.findOne({
            buyer: customerId,
            product: productId,
            status: 'cart'
        }).populate('discountCode').populate('buyer').populate('product');
        
        res.status(200).json(purchases);
    }catch{
        res.status(500).json({error: err});
    }
})

router.get('/get/purchases/by/buyer', async(req, res) => {
    const {customerId} = req.query;
    
    try{
        const purchases = await Purchase.find({

            buyer: customerId,
            status: 'delivered'

        }).populate('discountCode').populate('buyer').populate('product');
                
        res.status(200).json(purchases);
    }catch{
        res.status(500).json({error: err});
    }
})

router.get('/get/purchases/by/product', async(req, res) => {
    const {productId} = req.query;
    
    try{
        const purchases = await Purchase.find({

            product: productId,
            status: 'inShoppingCart'

        }).populate('discountCode').populate('buyer').populate('product');
        
        console.log(purchases);
        
        res.status(200).json(purchases);
    }catch{
        res.status(500).json({error: err});
    }
})

router.get('/get/delivered/purchases/by/product', async(req, res) => {
    const {productId} = req.query;
    
    try{
        const purchases = await Purchase.find({

            product: productId,
            status: 'delivered'

        }).populate('discountCode').populate('buyer').populate('product');

        const purchases_ = await Promise.all(
            purchases.map(async (purchase) => {
                const order = await Order.findOne({ purchases: { $in: [purchase._id] } });
        
                return { ...purchase.toObject(), orderedAt: order?.createdAt };
            })
        );
        
                
        res.status(200).json(purchases_);
    }catch(err){
        console.log((err));
        res.status(500).json({error: err});
    }
})

router.get('/get/delivered/purchases/by/buyer', async(req, res) => {
    const {buyerId} = req.query;
    console.log('buyerId :' + buyerId);
    
    try{
        const purchases = await Purchase.find({

            buyer: buyerId,
            status: 'delivered'

        }).populate('discountCode').populate('buyer');

        console.log(purchases.length);
        
                
        res.status(200).json(purchases);
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
        console.log(purchase.product);
        

        await Purchase.findByIdAndDelete(id);

        res.status(200).json({ message: 'Purchase deleted successfully!', customer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/purchase', async (req, res) => {
    const updatedPurchase = req.body;

    if (!updatedPurchase) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const updatedPurchaseResult = await Purchase.findOneAndUpdate(
            { _id: updatedPurchase._id },
            updatedPurchase,
            { new: true }
        ).populate('discountCode').populate('buyer').populate('product');

        if (!updatedPurchaseResult.shoppingCart) {
            return res.status(210).json({ message: 'No shopping cart associated with the purchase.' });
        }

        const shoppingCart = await ShoppingCart.findOne({ _id: updatedPurchaseResult.shoppingCart })
            .populate('purchases', 'totalPrice');

        const totalPrice = shoppingCart.purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);

        await ShoppingCart.findOneAndUpdate(
            { _id: shoppingCart._id },
            {
                totalPrice,
                lastUpdate: new Date(),
            },
            { new: true }
        );

        res.status(200).json(updatedPurchaseResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.put('/update/quantity', async (req, res) => {
    const updatedPurchase = req.body;
        
    if (!updatedPurchase) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        
        await Purchase.findOneAndUpdate(
            { _id: updatedPurchase._id },
             updatedPurchase,
            { new: true }
        );

        const getTotalPriceOfShoppingCart = (shoppingCart) => {
            let totalPrice = 0;
            shoppingCart.purchases.forEach(purchase => {
                totalPrice = totalPrice + purchase.totalPrice
            });
            return totalPrice;
        }

        const shoppingCart = await ShoppingCart.findOne({_id: updatedPurchase.shoppingCart}).populate('purchases');

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

router.put('/update/likeStatus', async(req, res) => {
    const {purchaseId, likeStatus} = req.body;

    
    if(!purchaseId){
        return res.status(404).json({error: 'purchaseId id is required !'});
    }

    try{

        const updatedPurchase = await Purchase.findOneAndUpdate(
            {_id: purchaseId},
            {like: likeStatus},
            {new: true}
        )

        let customer = await Customer.findOne({_id: updatedPurchase.buyer})

        
        if (likeStatus == true) {

            customer = await Customer.findOneAndUpdate(
                {_id: updatedPurchase.buyer},
                {$addToSet: {favorite: updatedPurchase.product._id}},
                {new: true}
            )

        } else {

            customer = await Customer.findOneAndUpdate(
                {_id: updatedPurchase.buyer},
                {$pull: {favorite: updatedPurchase.product._id}},
                {new: true}
            )

        }
        

        res.status(200).json({ message: 'like status updated successfully!', updatedCustomer: customer });
        
    }catch(err){
        res.status(500).json({error: err});
        console.log(err);
        
    }
});



module.exports = router;

