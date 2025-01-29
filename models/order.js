const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
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
        default: null,
    },
    status: {
        type: String,
        default: 'processing',
        enum: ['cart', 'processing', 'packaged', 'shipped', 'delivered', 'canceled', 'failed','Being returned', 'returned', 'out_of_stock', 'ready_for_pickup'],
    },    
    note: {
        type: String,
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
    discountCode: {
        type: mongoose.Schema.Types.ObjectId || null,
        default: null,
        ref: 'discountCodes',
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    deleveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'deleveryBoys'
    },
    lastUpdate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: new Date,
    },
})

const Order = mongoose.model('orders', OrderSchema);
module.exports = Order;