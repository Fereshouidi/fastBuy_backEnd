
const express = require('express');
const DiscountCode = require('../models/discountCode');
const router = express.Router();

router.post('/add/discountCode', async(req, res) => {
    const discountCodeData = req.body;
    
    try{
        const discountCode = await new DiscountCode(discountCodeData);
        await discountCode.save();
        res.status(201).json(discountCode);

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router;