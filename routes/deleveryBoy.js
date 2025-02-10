
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

router.get('/get/all/deleveryBoys', async(req, res) => {
      
   try{
       const allDeleveryBoys = await DeleveryBoy.find();
       res.status(200).json(allDeleveryBoys);

   }catch(err){
       res.status(500).json({error: err.message});
       console.log(err);
   }
})

router.put('/update/manyDeliveryBoys', async (req, res) => {
    try {
        const { updatedDeliveryBoys } = req.body;

        if (!Array.isArray(updatedDeliveryBoys) || updatedDeliveryBoys.length === 0) {
            return res.status(400).json({ error: 'Invalid deliveryBoys data!' });
        }

        const updatedDeliveryBoysData = await Promise.all(
            updatedDeliveryBoys.map(async (deliveryBoy) => {
                if (deliveryBoy.password) {
                    const salt = await bcrypt.genSalt(10);
                    deliveryBoy.password = await bcrypt.hash(deliveryBoy.password, salt);
                }
                return await DeleveryBoy.findOneAndUpdate({ _id: deliveryBoy._id }, deliveryBoy, { new: true });
            })
        );

        res.status(200).json(updatedDeliveryBoysData);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/update/deleveryBoy/timeTable', async (req, res) => {
    const { id, newTimeTable } = req.body; 

    if (!id || !newTimeTable) {
        return res.status(400).json({ error: "Missing required fields: id or newTimeTable" });
    }

    try {
        const updatedDeleveryBoy = await DeleveryBoy.findOneAndUpdate(
            { _id: id },
            { timeTable: newTimeTable },
            { new: true } 
        );

        if (!updatedDeleveryBoy) {
            return res.status(404).json({ error: "Delivery boy not found !" });
        }

        return res.status(200).json(updatedDeleveryBoy);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/manyDeliveryBoys', async (req, res) => {
    const {deliveryBoysIds} = req.query;
    
    if (!deliveryBoysIds) {
        return res.status(400).json({ error: "No deliveryBoys IDs provided" });
    }

    try {
        await Promise.all(
            deliveryBoysIds.map(deliveryBoysId => DeleveryBoy.findOneAndDelete({ _id: deliveryBoysId }))
        );

        res.status(200).send(`${deliveryBoysIds.length} delivery boy(s) have been deleted successfully`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;