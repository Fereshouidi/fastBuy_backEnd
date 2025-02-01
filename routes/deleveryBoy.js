
const express = require('express');
const DeleveryBoy = require('../models/deleveryBoy');
const router = express.Router();
const bcrypt = require('bcrypt');


router.post('/add/deleveryBoy', async(req, res) => {

     console.log('time:' + new Date());
    
    const {deleveryBoyData} = req.body;
    // console.log(deleveryBoyData);
    
    try{
        const newDeleveryBoy = await new DeleveryBoy(deleveryBoyData);
        await newDeleveryBoy.save();

        console.log(new Date(newDeleveryBoy.createdAt));
        
        //console.log(newDeleveryBoy.createdAt);
        
        res.status(201).json(newDeleveryBoy);

    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
        
    }
})

module.exports = router;