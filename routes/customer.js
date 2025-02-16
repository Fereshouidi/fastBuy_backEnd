
const express = require('express');
const Customer = require('../models/customer');
const router = express.Router();
const bcrypt = require('bcrypt');
const Purchase = require('../models/purchase');
const Order = require('../models/order');
const { populate } = require('../models/shoppingCart');


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
        const allCustomers = await Customer.find()
        .populate([{
            path: 'ShoppingCart',
            populate: {
                path: 'purchases',
                populate: {
                    path: 'product',
                    populate: {
                        path: 'discount'
                    }
                },
                
            },
        }])
        .populate([{
            path: 'favorite',
            populate: {
                path: 'discount'
            }
        }])
        
        const allCustomers_ = await Promise.all(
            allCustomers.map( async (customer) => {
                const ordersDelivered_ = await Order.find({ customer: customer._id, status: "delivered" })
                .populate([{
                    path: 'purchases',
                    populate: {
                        path: 'product',
                        populate: {
                            path: 'discount'
                        }
                    }
                }]);
            

                if (ordersDelivered_.purchases != []) {
                    console.log( 'ordersDelivered_ : ' + ordersDelivered_);
                    
                }
                return { ...customer.toObject(), historique: ordersDelivered_ };
            })

        )

        res.status(200).json(allCustomers_);
    }catch(err) {
        res.status(500).json({error: err});
    }
})

router.get('/get/customer/byId', async(req, res) => {
    const id = req.query.id;
        
    try{
        const customer = await Customer.findById(id).populate('ShoppingCart').populate({
            path: 'favorite',
            populate: {
                path: 'discount'
            }
        })

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
        const customer = await Customer.findOne({userName}).populate('favorite');
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

router.put('/update/customer', async(req, res) => {

    const {id, updatedCustomerData} = req.body;    

    if(!id){
        return res.status(404).json({error: 'customer id is required !'});
    }

    if (!updatedCustomerData) {
        return res.status(400).json({ error: 'Invalid updatedCustomer value!' });
    }

    if (updatedCustomerData.password) {
        const salt = await bcrypt.genSalt(10); 
        updatedCustomerData.password = await bcrypt.hash(updatedCustomerData.password, salt);
    }

    try{
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id, 
            updatedCustomerData, 
            { new: true }
        );
        
        if(!updatedCustomer){
            return res.status(404).json({ error: 'cannot find that customer!' });
        }

        res.status(200).json({ message: 'Customer updated successfully!', customer: updatedCustomer });
        
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
        
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
    
    try {
        const customer = await Customer.findOneAndUpdate({token}, {verification: true});
        res.status(200).send(customer)
    }catch(err){
        res.status(500).json({error: err});
    }
})

router.patch('/update/manyCustomers', async (req, res) => {

    try {
        const { updatedCustomers } = req.body;

        console.log(updatedCustomers);
        

        if (!Array.isArray(updatedCustomers) || updatedCustomers.length === 0) {
            return res.status(400).json({ error: 'Invalid customers data!' });
        }

        const updatedCustomersData = await Promise.all(
            updatedCustomers.map(async (customer) => {
                if (customer.password) {
                    const salt = await bcrypt.genSalt(10);
                    customer.password = await bcrypt.hash(customer.password, salt);
                }
                return await Customer.findOneAndUpdate({ _id: customer._id }, customer, { new: true });
            })
        );

        res.status(200).json(updatedCustomersData);
        console.log(updatedCustomersData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/manyCustomer', async (req, res) => {
    const {customersId} = req.query;
    
    if (!customersId) {
        return res.status(400).json({ error: "No customer IDs provided" });
    }

    try {
        await Promise.all(
            customersId.map(customerId => Customer.findOneAndDelete({ _id: customerId }))
        );

        res.status(200).send(`${customersId.length} customer(s) have been deleted successfully`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;

