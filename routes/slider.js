const express = require('express');
const router = express.Router();
const Slider = require('../models/slider');
const Product = require('../models/product');

router.post('/add/slider', async(req, res) => {
    const data = req.body;
    try{
        const newSlider = await new Slider(data);
        newSlider.save();
        res.status(201).json(newSlider);

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.get('/get/slider', async(req, res) => {
    
    try{
        let slider = await Slider.findById('674ce6fccefd08dd4b9b8a6b');
        const sliderProducts = await Product.find({_id: {$in: slider.products}})
        slider.products.length = 0;
        for (let product of sliderProducts){
            slider.products.push(product);
        }
        res.status(200).json(slider);

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put('/update/slider/tittle', async(req, res) => {
    const {tittle} = req.body;
    
    try{
        const updatedSlider = await Slider.findOneAndUpdate(
            {_id: '674ce6fccefd08dd4b9b8a6b'},
            {tittle: tittle}
        )
        res.status(200).json({message: 'time updated successfuly !', updatedSlider});
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put('/update/slider/products', async(req, res) => {
    const {products} = req.body;
    
    try{
        const updatedSlider = await Slider.findOneAndUpdate(
            {_id: '674ce6fccefd08dd4b9b8a6b'},
            {products: products}
        )
        res.status(200).json({message: 'time updated successfuly !', updatedSlider});
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put('/update/slider/changingTime', async(req, res) => {
    const {changingTime} = req.body;
    
    try{
        const updatedSlider = await Slider.findOneAndUpdate(
            {_id: '674ce6fccefd08dd4b9b8a6b'},
            {changingTime: changingTime}
        )
        res.status(200).json({message: 'time updated successfuly !', updatedSlider});
    }catch(err){
        res.status(500).json({error: err.message})
    }
})






module.exports = router;