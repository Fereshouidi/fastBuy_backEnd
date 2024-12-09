const mongoose = require('mongoose');

const CategoriesSectionShema = new mongoose.Schema({

    categoriesList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'categories',
    }

})

const CategoriesSection = mongoose.model('CategoriesSection', CategoriesSectionShema);
module.exports = CategoriesSection;