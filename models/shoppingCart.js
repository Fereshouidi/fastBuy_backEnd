const mongoose = require('mongoose');
const { type } = require('os');

const ShoppingCartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'products',
    },
    purchases: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'purchases',
    },
    discountCode: {
        type: mongoose.Schema.Types.ObjectId || null,
        default: null,
        ref: 'discountCodes',
    },
    totalPrice: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        default: 'cart',
        enum: ['cart', 'processing', 'shipped', 'delivered', 'canceled', 'payment_failed','Being returned', 'returned', 'out_of_stock', 'ready_for_pickup'],
    },    
    address: {
        type: String,
        default: null,
    },
    paymentMethod: {
        type: String,
        default: 'cash',
        enum: ['cash', 'paypal', 'masterCard']
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    lastUpdate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: new Date,
    },
})

const ShoppingCart = mongoose.model('shoppingCarts', ShoppingCartSchema);
module.exports = ShoppingCart;


