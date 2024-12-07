const express = require('express');
const router = express.Router();
const BullentinBoard = require('../models/bulletinBoard');

router.post('/add/bullentinBoard', async(req, res) => {
    const data = req.body;
    try{
        const newBullentinBoard = await new BullentinBoard(data);
        newBullentinBoard.save();
        res.status(201).json(newBullentinBoard);

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.get('/get/bullentinBoard', async(req, res) => {
    
    try{
        const bullentinBoard = await BullentinBoard.findById('674ce08a82feae9cc9d437f7');
        res.status(200).json(bullentinBoard);

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.get('/get/bullentinBoard_two', async(req, res) => {
    
    try{
        const bullentinBoard = await BullentinBoard.findById('675200be4cc826f5e3e5f8b5');
        res.status(200).json(bullentinBoard);

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put('/update/bullentinBoard/images', async(req, res) => {
    const {images} = req.body;
    
    try{
        const updatedBullentinBoard = await BullentinBoard.findOneAndUpdate(
            {_id: '674ce08a82feae9cc9d437f7'},
            {images: images}
        )
        res.status(200).json({message: 'time updated successfuly !', updatedBullentinBoard});
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put('/update/bullentinBoard/changingTime', async(req, res) => {
    const {changingTime} = req.body;
    
    try{
        const updatedBullentinBoard = await BullentinBoard.findOneAndUpdate(
            {_id: '674ce08a82feae9cc9d437f7'},
            {changingTime: changingTime}
        )
        res.status(200).json({message: 'time updated successfuly !', updatedBullentinBoard});
    }catch(err){
        res.status(500).json({error: err.message})
    }
})





module.exports = router;