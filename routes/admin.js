const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

router.post('/create/admin', async (req, res) => {

    const { adminData } = req.body;

    try {
        if (!adminData) {
            return res.status(400).json({ error: 'Admin data is required' });
        }

        const newAdmin = new Admin(adminData);
        await newAdmin.save();

        res.status(201).json(newAdmin);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/get/admin/by/id/:id', async (req, res) => {

    const { id } = req.params;
    console.log(id); 

    try {
        const admin = await Admin.findOne({_id: id});

        if (!admin) {
            return res.status(404).json({error : 'This admin not found!'});
        }

        res.status(200).json(admin); 

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get/all/admin', async (req, res) => {

    try {
        const admins = await Admin.find();
        res.status(200).json(admins); 

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get/admin/byCredentials', async(req, res) => {
    const {userName, password} = req.query;
    
    if (!userName || !password) {
        return res.status(400).json({ error: 'Username and password are required!' });
    }
    
    try{
        const admin = await Admin.findOne({name: userName});
        if(!admin){
            return res.status(404).json({error: 'admin not found !'})
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'password is wrong !' });
        }
        
        return res.status(200).json(admin);

    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
})

router.put('/update/admin/by/id', async (req, res) => {

    const { id, updatedAdmin } = req.body;    

    try {
        const adupdatedAdminmin_ = await Admin.findOneAndUpdate({_id: id}, updatedAdmin, {new: true});

        if (!adupdatedAdminmin_) {
            return res.status(404).json({error : 'This admin not found!'});
        }

        res.status(200).json(adupdatedAdminmin_); 
        console.log(adupdatedAdminmin_);
        

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/admin/verification', async(req, res) => {

    const { token } = req.query;
    console.log(token);
    
    
    try {
        const admin = await Admin.findOneAndUpdate({token}, {verification: true});
        res.status(200).send(admin)
    }catch(err){
        res.status(500).json({error: err});
    }
})


module.exports = router;
