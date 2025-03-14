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

router.get('/get/all/bullentinBoard', async(req, res) => {
    
    try{
        const bullentinBoards = await BullentinBoard.find();
        res.status(200).json(bullentinBoards);

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.get('/get/bullentinBoard', async(req, res) => {
    
    try{
        const bullentinBoard = await BullentinBoard.find();
        res.status(200).json(bullentinBoard[0]);

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.get('/get/bullentinBoard_two', async(req, res) => {
    
    try{
        const bullentinBoard = await BullentinBoard.find();
        res.status(200).json(bullentinBoard[1]);

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put('/update/bullentinBoard/by/id', async(req, res) => {
    const {updatedBullentinBoardData} = req.body;
    
    try{
        const updatedBullentinBoard = await BullentinBoard.findOneAndUpdate(
            {_id: updatedBullentinBoardData._id},
            updatedBullentinBoardData,
            {new: true}
        )
        res.status(200).json({message: 'time updated successfuly !', updatedBullentinBoard});
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