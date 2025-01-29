
const express = require('express');
const DeleveryBoy = require('../models/deleveryBoy');
const router = express.Router();
const bcrypt = require('bcrypt');


router.post('/add/deleveryBoy', async(req, res) => {
    const {deleveryBoyData} = req.body;
    try{
        const newDeleveryBoy = await new DeleveryBoy(deleveryBoyData);
        await newDeleveryBoy.save();
        res.status(201).json(newDeleveryBoy);

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router;