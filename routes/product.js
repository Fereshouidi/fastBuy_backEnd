
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/reviews');
const Discount = require('../models/discount');
const Categorie = require('../models/categorie');
const Customer = require('../models/customer');
const Order = require('../models/order');
const Purchase = require('../models/purchase');


router.post('/add/Product', async(req, res) => {
    const productData = req.body;
    
    try{
        const newProduct = await new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    }catch(err){
        res.status(500).json({error: err.message});        
    }
})

router.get('/get/allProducts', async (req, res) => {
    try {
        const allProducts_ = await Product.find().populate('discount')
        const allProducts = allProducts_.filter((product) => product.visible !== false);
        
        res.status(200).json(allProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get/product/byId', async(req, res) => {
    const id = req.query.id;
    
    try{
        const product = await Product.findById(id)
            .populate('discount')
            .populate('categorie')
            .populate('discountCode');

        if(product){
            res.status(200).json(product);
        }else{
            res.status(404).json({error: 'product not found !'})
        }

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/top5BestSellingProducts', async (req, res) => {

    try {

        const allProducts = await Product.find({visible: true});

        const productSales = await Promise.all(
            allProducts.map(async (product) => {
                const purchases = await Purchase.find({
                    product: product._id,
                    status: 'delivered'
                });
        
                const totalSold = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
                const totalProfit = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
        
                return {
                    product,
                    totalSold,
                    totalProfit
                };
            })
        );
        
        const top10BestSellingProducts = productSales
            .sort((a, b) => b.totalSold - a.totalSold) 
            .slice(0, 5);
        
                
        res.status(200).json(top10BestSellingProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
        
    }
});

router.get('/get/least5SellingProducts', async (req, res) => {
    try {
        const allProducts = await Product.find({visible: true});

        const productSales = await Promise.all(
            allProducts.map(async (product) => {
                const purchases = await Purchase.find({
                    product: product._id,
                    status: 'delivered'
                });

                const totalSold = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
                const totalProfit = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);

                return {
                    product,
                    totalSold,
                    totalProfit
                };
            })
        );

        const least5SellingProducts = productSales
            .sort((a, b) => a.totalSold - b.totalSold)
            .slice(0, 5);

        res.status(200).json(least5SellingProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.get('/get/top5LowestStock', async (req, res) => {
    try {
        const top5LowestStock = await Product.find({ visible: true })
            .sort({ quantity: 1 })
            .limit(5);

        res.status(200).json(top5LowestStock);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});


router.get('/get/product/by/biggestDiscount', async(req, res) => {
    try{
        const discount = await Discount.find().sort({ percentage: -1 });

        if(discount[0]){
            const products = await Product.find({discount: discount[0]._id});
            res.status(200).json({discount: discount[0], products});
                        
            console.log('done');
            
        }else{
            res.status(404).json({error: 'product not found !'})
        }

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/products/byRating', async (req, res) => {
    const {page, limit} = req.query;
    const skip = (page - 1) * limit;
    try {
        const allProducts_ = await Product.find().sort({ totalRating: -1 }).limit(parseInt(limit)).skip(parseInt(skip)).populate('discount');
        const allProducts = allProducts_.filter((product) => product.visible !== false);

        res.status(200).json(allProducts);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get/products/by/name', async (req, res) => {
    const {searchQuery} = req.query;

    try {
        const products_ = await Product.find({
            $or: [
                {"name.english": {$regex: searchQuery, $options: 'i'}},
                {"name.arabic": {$regex: searchQuery, $options: 'i'}}
            ]
        }).sort({
            totalRating : (-1)
        })
        .populate('discount')
        .populate('categorie')
        .populate('discountCode');

        const products = products_.filter((product) => product.visible !== false);


        res.status(200).json(products);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
        
    }
});

router.put('/update/product', async (req, res) => {
    const { updatedProduct } = req.body;
    console.log(updatedProduct);
    

    if (!updatedProduct || !updatedProduct._id) {
        return res.status(400).json({ error: 'Product ID is required!' });
    }

    try {
        const product = await Product.findByIdAndUpdate(
            updatedProduct._id, 
            { $set: updatedProduct }, 
            { new: true, runValidators: true } 
        ).populate('discount')

        if (!product) {
            return res.status(404).json({ error: 'Cannot find that product!' });
        }

        res.status(200).json({ message: 'Product updated successfully!', product });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
});

router.put('/update/product/categorie', async(req, res) => {
    const {productId, categorieId} = req.body;

    if(!productId){
        return res.status(404).json({error: 'product id is required !'});
    }

    if (!categorieId) {
        return res.status(404).json({ error: 'categorie not found !' });
    }

    try{
        const updatedProduct = await Product.findByIdAndUpdate({_id: productId}, {categorie: categorieId}, {new: true});

        if(!updatedProduct){
            return res.status(404).json({ error: 'cannot find that product!' });
        }

        res.status(200).json({ message: 'Price updated successfully!', product: updatedProduct });
        
    }catch(err){
        res.status(500).json({error: err});
    }
})

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

router.get('/get/product/for/managementPage', async(req, res) => {
    const {categorieId, searchQuery} = req.query;
        
    try{

        let categorie = categorieId;

        if (categorieId) {
            categorie = await Categorie.findOne({_id: categorieId});
        }        

        const categories = [];
        const stack = [categorieId];

        while (stack.length > 0) {
            const currentId = stack.pop();
            categories.push(currentId);
        
            if (currentId) {
                const currentCategorie = await Categorie.findOne({ _id: currentId }).exec(); 
                
                if (currentCategorie && currentCategorie.childrenCategories) {
                    stack.push(...currentCategorie.childrenCategories);
                }
            }
        }
        

        let products = [];
        
        if (categorie?.parentCategorie && searchQuery) {
            products = (await Product.find({
                categorie: { $in: categories }, 
                $or: [ 
                    { "name.english": { $regex: searchQuery, $options: 'i' } },
                    { "name.arabic": { $regex: searchQuery, $options: 'i' } }
                ]
            }).populate('discount').populate('categorie').populate('discountCode'));

        }else if (!categorie && searchQuery) {

            products = (await Product.find(
                {$or: [
                    {"name.english": {$regex: searchQuery, $options: 'i'}},
                    {"name.arabic": {$regex: searchQuery, $options: 'i'}}
                ]}
            ).populate('discount').populate('categorie').populate('discountCode'));

        }else if (categorie && !categorie.parentCategorie && searchQuery) {

            products = (await Product.find(
                {$or: [
                    {"name.english": {$regex: searchQuery, $options: 'i'}},
                    {"name.arabic": {$regex: searchQuery, $options: 'i'}}
                ]}
            ).populate('discount').populate('categorie').populate('discountCode'));

        }else if (categorie?.parentCategorie && !searchQuery) {

            products = (await Product.find(
                {categorie: { $in: categories }}
            ).populate('discount').populate('categorie').populate('discountCode'));

        } else {
            products = (await Product.find().populate('discount').populate('categorie').populate('discountCode'));
        }

        if(products){
            const products_ = products.filter((product) => product.visible !== false);
            res.status(200).json(products_);
        }else{
            res.status(404).json({error: 'product not found !'})
        }

    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
        
    }
})

router.put('/update/product/imagePrincipal', async(req, res) => {
    const {productId, imagePrincipal} = req.body;

    if(!productId){
        return res.status(404).json({error: 'product id is required !'});
    }

    if (!imagePrincipal || typeof newPrice !== 'string' ) {
        return res.status(400).json({ error: 'Invalid imagePrincipal value!' });
    }

    try{

        const uploadImg = await uploadImg(imagePrincipal);
        const updatedProduct = await Product.findByIdAndUpdate({_id: productId}, {imagePrincipal: imagePrincipal}, {new: true});

        if(!updatedProduct){
            return res.status(404).json({ error: 'cannot find that product!' });
        }

        res.status(200).json({ message: 'Price updated successfully!', product: updatedProduct });
        
    }catch(err){
        res.status(500).json({error: err});
    }
})

router.delete('/delete/product/by/id/:productId', async (req, res) => {
    const { productId } = req.params; 
        
    if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
    }

    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            { 
                visible: false,
                categorie: null, 
                discount: null
            },
        );

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await Customer.updateMany(
            {},
            {$pull: {favorite: productId}}
        )

        res.status(200).json({ message: "Product has been removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
        
    }
});



module.exports = router;


