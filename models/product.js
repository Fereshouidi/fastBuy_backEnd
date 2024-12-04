const mongoose = require('mongoose');
const { type } = require('os');

const ProductShema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    category: {
        type: Number,
    },
    images: {
        type: [],
    },
    imagePrincipal: {
        type: String,
    },
    discount: {
        type: Number,
    },
    discountSticker: {
        type: String,
    },
    startOfDiscount: {
        type: Date,
    },
    endOfDiscount: {
        type: Date,
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
        unum: [0,1,2,3,4,5],
    },
    createdAt: {
        type: Date,
    }

});

const Product = mongoose.model('products', ProductShema);
module.exports = Product;

