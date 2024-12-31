
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
    shoppingCart: {
        type: mongoose.Schema.Types.ObjectId || null,
        ref: 'shoppingCarts',
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
    discountCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discountCodes',
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
    like : {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date,
    }
})

const Purchase = mongoose.model('purchases', PurchaseSchema);
module.exports = Purchase;




