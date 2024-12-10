const express = require('express');
const router = express.Router();
const ConpanyInformations = require('../models/companyInformations');
const CategoriesSection = require('../models/categoriesSection');



router.post('/add/conpanyInformations', async(req, res) => {
    const data = req.body;
    try{
        const newConpanyInformations = await new ConpanyInformations(data);
        await newConpanyInformations.save();
        console.log(newConpanyInformations);
        
    }catch(err){
        console.log(err);
        
    }
})

router.get('/get/conpanyInformations', async(req, res) => {
    try{
        const conpanyInformations = await ConpanyInformations.findById('675889a2c692d613c16b8c47');
        res.status(200).json(conpanyInformations);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/bestCategories', async(req, res) => {
    try{
        const bestCategories = await CategoriesSection.findById('675601abf7169947cff9f0d1').populate('categoriesList');
        res.status(200).json(bestCategories);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})


module.exports = router;