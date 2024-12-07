const mongoose = require('mongoose');

const CategorieSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    parentCategorie: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categories', 
        default: null 
    },
    childrenCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    }],
    margin: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date,
    }

})

const Categorie = mongoose.model('categories', CategorieSchema);
module.exports = Categorie;