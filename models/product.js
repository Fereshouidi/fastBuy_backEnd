const mongoose = require('mongoose');
const { type } = require('os');
const { availableMemory } = require('process');
const Categorie = require('./categorie');

const ProductShema = new mongoose.Schema({
    name: {
        english : {
            type: String,
        },
        arabic : {
            type: String,
        }
    },
    description: {
        english : {
            type: String,
        },
        arabic : {
            type: String,
        }    
    },
    price: {
        type: Number,
    },
    finalPrice: {
        type: Number,
    },
    currencyType: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
    },
    images: {
        type: [],
    },
    imagePrincipal: {
        type: String,
    },
    discount: {
        type: mongoose.Schema.Types.ObjectId ,
        default: null,
        ref: 'discounts',
    },
    discountCode: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'discountCodes',
    },
    inPurchases: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'purchases',
    },
    buyers: {
        type: [mongoose.Schema.Types.ObjectId],
        req: 'customers',
    },
    reviews: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'reviews'
    },
    totalRatingSum:  {
        default: 0,
        type: Number,
    },
    totalRating: {
        type: Number,
        default: 0
    },
    evaluators: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'customer'
    },
    visible: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
    
});

ProductShema.pre('save', async function(next) {

    if (!this.categorie) {
        const defaultCategorie = await Categorie.findOne({ parentCategorie: null });
        this.categorie = defaultCategorie ? defaultCategorie._id : null;
    }
    next();
});

const Product = mongoose.model('products', ProductShema);
module.exports = Product;

