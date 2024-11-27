const mongoose = require('mongoose');
const { type } = require('os');
const bcrypt = require('bcrypt');
const ShoppingCart = require('./shoppingCart');

const CustomerSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    purchases: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'purchases',
    },
    ShoppingCarts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'shoppingCarts',
    },
    phone: {
        type: Number,
    },
    timeOfRegister: {
        type: Date,
        default: Date.now,
    }
})

CustomerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); 
    }
    next();
});

const Clent = mongoose.model('customers', CustomerSchema);
module.exports = Clent;

