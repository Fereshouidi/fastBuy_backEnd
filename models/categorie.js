const mongoose = require('mongoose');

const CategorieSchema = new mongoose.Schema({

    name: {
        english: {
            type: String,
        },
        arabic: {
            type: String,
        },
    },
    parentCategorie: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categories', 
        default: null 
    },
    childrenCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'categories'
    }],
    discountCode: {
        type: mongoose.Schema.Types.ObjectId || null,
        ref: 'discountCodes',
    },
    margin: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,    
    },

})

const Categorie = mongoose.model('categories', CategorieSchema);
module.exports = Categorie;
