const express = require('express');
const router = express.Router();
const CategoriesSection = require('../models/categoriesSection');
const Categorie = require('../models/categorie');
const Product = require('../models/product')



router.post('/add/categoriesSection', async(req, res) => {
    const {categoriesId} = req.body;
    try{
        const newCategoriesSection = new CategoriesSection({categoriesList: categoriesId});
        await newCategoriesSection.save();
        res.status(201).json(newCategoriesSection)
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.get('/get/categoriesSection', async (req, res) => {
    try {
        const categoriesSection_ = [];
        const categoriesSection = await CategoriesSection.findById("675601abf7169947cff9f0d1");

        if (!categoriesSection || !categoriesSection.categoriesList) {
            return res.status(404).json({ error: "Categories section not found" });
        }

        for (const categorieId of categoriesSection.categoriesList) {
            const catgorie = await Categorie.findOne({ _id: categorieId });

            const categories = [];
            const stack = [catgorie._id];

            while (stack.length > 0) {
                const currentId = stack.pop();
                categories.push(currentId);

                const currentCategorie = await Categorie.findById(currentId).populate('childrenCategories');
                if (currentCategorie) {
                    const childrenCategorie = currentCategorie.childrenCategories.map((child) => child._id);
                    stack.push(...childrenCategorie);
                }
            }

            const products = await Product.find({ categorie: { $in: categories } }).populate('discount');

            categoriesSection_.push({ catgorie, products });
        }

        res.status(200).send(categoriesSection_);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





module.exports = router;