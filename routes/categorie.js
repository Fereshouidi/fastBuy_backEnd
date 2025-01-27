const express = require('express');
const router = express.Router();
const Categorie = require('../models/categorie');
const CategoriesSection = require('../models/categoriesSection');
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

    const { categorieId } = req.query;
    console.log(categorieId);
    
    
    try {
        const categorie = await Categorie.findOne({_id: categorieId});

        console.log(categorie);

        if (!categorie) {
            return res.status(404).json("categorie not found !");
        }        

        res.status(200).json(categorie);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
        
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

router.put('/rename/categorie/by/id', async (req, res) => {
    const {categorieId, newName} = req.body;

    console.log(categorieId, newName);
    
    try {
        const categorie = await Categorie.findOne({_id: categorieId});
        console.log(categorie);
        

        if (!categorie) {
            return res.status(400).json({error: "This categorie doesn't found ! "})
        }

        if (!categorie.parentCategorie) {
            return res.status(400).json({error: "The name of this categorie can't be changed ! "})
        }

        const updatedCategorie = await Categorie.findOneAndUpdate(
            {_id: categorieId},
            {name: newName}
        );

        res.status(200).json({
            message: 'Category updated successfully!',
            category: updatedCategorie,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/categorie/by/id/:categorieId', async (req, res) => {
    const { categorieId } = req.params;

    try {
        const categorie = await Categorie.findById(categorieId);
        if (!categorie) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const getAllChildCategories = async (parentId) => {
            let categoriesToDelete = [parentId];
            let queue = [parentId];

            while (queue.length > 0) {
                const currentId = queue.shift();
                const children = await Categorie.find({ parentCategorie: currentId });

                if (children.length > 0) {
                    queue.push(...children.map(cat => cat._id));
                    categoriesToDelete.push(...children.map(cat => cat._id));
                }
            }
            return categoriesToDelete;
        };

        const categoriesToDelete = await getAllChildCategories(categorieId);

        await Categorie.deleteMany({ _id: { $in: categoriesToDelete } });

        const categorieParent = await Categorie.findByIdAndUpdate(
            categorie.parentCategorie,
            {$pull: {childrenCategories: categorieId}}
        );


        const updateCategoriesSection = await CategoriesSection.updateMany(
            {},
            { $pull: { categoriesList: { $in: categoriesToDelete } } }
        );

        res.status(200).json({
            message: 'Category and its subcategories deleted successfully!',
            updateCategoriesSection: updateCategoriesSection,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});







module.exports = router;
