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
    inPurchases: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'purchases',
    },
    buyers: {
        type: [mongoose.Schema.Types.ObjectId],
        req: 'customers',
    },
    createdAt: {
        type: Date,
    }

});

const Product = mongoose.model('products', ProductShema);
module.exports = Product;

