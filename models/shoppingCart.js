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
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        default: 'cart',
        enum: ['cart', 'processing', 'shipped', 'delivered', 'canceled', 'payment_failed','Being returned', 'returned', 'out_of_stock', 'ready_for_pickup'],
    },    
    address: {
        type: String,
    },
    paymentMethod: {
        type: String,
        default: 'PaymentOnDelivery',
        enum: ['PaymentOnDelivery', 'paypal', 'masterCard']
    },
    shippingCost: {
        type: Number,
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


