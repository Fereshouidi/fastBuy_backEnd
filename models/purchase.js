
const mongoose = require('mongoose');
const { type } = require('os');

const PurchaseSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discounts',
    },
    quantity: {
        type: Number,
    },
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        default: 'cart',
        enum: ['cart', 'processing', 'shipped', 'delivered', 'canceled', 'payment_failed', 'returned', 'out_of_stock', 'ready_for_pickup'],
    },
    customerRating: {
        type: Number,
        unum: [0,1,2,3,4,5],
        default: null
    },
    customerNote:{
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: new Date,
    }
})

const Purchase = mongoose.model('purchases', PurchaseSchema);
module.exports = Purchase;




