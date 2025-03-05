
const express = require('express');
const DiscountCode = require('../models/discountCode');
const router = express.Router();

router.post('/add/discountCode', async(req, res) => {
    const {discountCodeData} = req.body;
    
    try{
        const discountCode = await new DiscountCode(discountCodeData);
        await discountCode.save();
        res.status(201).json(discountCode);

    }catch(err){
        console.log(err);
        
        res.status(500).json({error: err.message});
    }
})

router.get('/get/discountCodes/for/shoppingCarts', async(req, res) => {

    try{
        const discountCodes = await DiscountCode.find({
            target: 'shoppingCart'
        })
        res.status(201).json(discountCodes);

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/all/discountCodes', async(req, res) => {

    try{
        const discountCodes = await DiscountCode.find();
        res.status(201).json(discountCodes);

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/discountCodes/for/page/of/productManagement', async(req, res) => {

    try{
        const discountCodes = await DiscountCode.find({target: {$in: ['product', 'categorie']}});
        res.status(201).json(discountCodes);

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.patch('/update/all/discountCodes', async (req, res) => {
    const { discountsCode } = req.body;

    try {

        const updatedDiscounts = await Promise.all(

            discountsCode.map(async (discountCode) => {
                return await DiscountCode.findOneAndUpdate(
                    {_id: discountCode._id},
                    {$set: discountCode},
                    {new: true }
                );
            })
        )

        console.log(updatedDiscounts);
        
        res.status(200).json( updatedDiscounts );

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/discountCode/by/id/:id', async(req, res) => {
    const { id } = req.params;

    console.log(id);
    
    
    try{
        await DiscountCode.findByIdAndDelete({_id: id});
        res.status(201).json('discountCode deleted');

    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
})


module.exports = router;