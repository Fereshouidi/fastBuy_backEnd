const express = require('express');
const router = express.Router();
const Categorie = require('../models/categorie');
const Product = require('../models/product');

router.post('/add/categorie', async (req, res) => {
    const categorieData = req.body;

    try {
        const newCategorie = new Categorie(categorieData);
        await newCategorie.save();

        if (newCategorie.parentCategorie) {
            await Categorie.findOneAndUpdate(
                { _id: newCategorie.parentCategorie },
                { $push: { childrenCategories: newCategorie._id } }
            );
        }

        res.status(201).json({
            message: 'Category added successfully!',
            category: newCategorie,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get/categorie/by/id', async (req, res) => {

    const {id} = req.query;
    try {
        const categorie = await Categorie.findOne({_id: id});
        res.status(200).json(categorie)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get/categories/tree', async (req, res) => {
    try {
        const allCategories = await Categorie.find().lean();

        const categoryMap = new Map();
        allCategories.forEach(category => {
            category.children = []; 
            categoryMap.set(category._id.toString(), category);
        });

        const rootCategories = [];
        allCategories.forEach(category => {
            if (category.parentCategorie) {
                const parent = categoryMap.get(category.parentCategorie.toString());
                if (parent) {
                    parent.children.push(category);
                }
            } else {
                rootCategories.push(category);
            }
        });

        res.status(200).json(rootCategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get/categories/by/parent', async (req, res) => {

    const {parentId} = req.query;
    try {
        const categories = await Categorie.find({parentCategorie: parentId});
        res.status(200).json(categories)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get/categories/by/id', async (req, res) => {

    const {id} = req.query;
    try {
        const categorie = await Categorie.find({_id: id});
        res.status(200).json(categorie)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get/products/by/categorie', async(req, res) => {
    const {parentCategorieId} = req.query;
    
    try{
        const categories = [];
        const stack = [parentCategorieId];

        while (stack.length > 0){
            const currentId = stack.pop();
            categories.push(currentId);

            const currentCategorie = await Categorie.findById(currentId).populate('childrenCategories');
            if(currentCategorie){
                const childrenCategorie = currentCategorie.childrenCategories.map((child) => child._id);
                stack.push(...childrenCategorie);
            }
        }
        
        
        const products = await Product.find({categorie: {$in: categories}}).populate('discount')
         
        res.status(200).json(products);

    }catch(err){
        res.status(500).json({error: err.message})
    }
})









module.exports = router;
