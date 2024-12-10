const mongoose = require('mongoose');
const { type } = require('os');

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
    currencyType: {
        type: String,
    },
    quantity: {
        type: Number,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discounts',
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
    totalRating: {
        type: Number,
        enum: [0,1,2,3,4,5],
    },
    createdAt: {
        type: Date,
    }

});

const Product = mongoose.model('products', ProductShema);
module.exports = Product;

