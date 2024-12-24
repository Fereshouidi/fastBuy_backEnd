
const express = require('express');
const Customer = require('../models/customer');
const router = express.Router();
const bcrypt = require('bcrypt');


router.post('/add/customer', async(req, res) => {
    const {customerData} = req.body;
    try{
        const newCustomer = await new Customer(customerData);
        await newCustomer.save();
        res.status(201).json(newCustomer);

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/allCustomers', async(req, res) => {
    try{
        const allCustomers = await Customer.find();
        res.status(200).json(allCustomers);
    }catch{
        res.status(500).json({error: err});
    }
})

router.get('/get/customer/byId', async(req, res) => {
    const id = req.query.id;
        
    try{
        const customer = await Customer.findById(id).populate('ShoppingCart')

        if(customer){
            res.status(200).json(customer);
        }else{
            res.status(404).json({error: 'customer not found !'})
        }

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/customer/byCredentials', async(req, res) => {
    const {userName, password} = req.query;
    
    if (!userName || !password) {
        return res.status(400).json({ error: 'Username and password are required!' });
    }
    
    try{
        const customer = await Customer.findOne({userName});
        if(!customer){
            return res.status(404).json({error: 'customer not found !'})
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'password is wrong !' });
        }
        
        return res.status(200).json(customer);

    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.put('/update/customer/phone', async(req, res) => {
    const {id, phone} = req.body;

    if(!id){
        return res.status(404).json({error: 'customer id is required !'});
    }

    if (!phone || typeof phone !== 'number' || phone <= 0) {
        return res.status(400).json({ error: 'Invalid phone value!' });
    }

    try{
        const updatedCustomer = await Customer.findByIdAndUpdate({_id: id}, {phone}, {new: true});

        if(!updatedCustomer){
            return res.status(404).json({ error: 'cannot find that customer!' });
        }

        res.status(200).json({ message: 'Phone number updated successfully!', cutomer: updatedCustomer });
        
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.delete('/delete/customer/byId/:id', async(req, res) => {
    const id = req.params.id;

    if(!id){
        return res.status(400).json({ error: 'customer ID is required!' });
    }

    try{
        await Customer.findByIdAndDelete(id);
        res.status(200).json({message: 'the customer is deleted successfuly !'})
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/account/verification', async(req, res) => {

    const { token } = req.query;
    console.log(token);
    
    try {
        const customer = await Customer.findOneAndUpdate({token}, {verification: true});
        res.status(200).send(customer)
    }catch(err){
        res.status(500).json({error: err});
    }
})


module.exports = router;

