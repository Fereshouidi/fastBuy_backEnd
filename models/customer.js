const mongoose = require('mongoose');
const { type } = require('os');
const bcrypt = require('bcrypt');
const ShoppingCart = require('./shoppingCart');
const { verify } = require('crypto');

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
    // purchases: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: 'purchases',
    // },
    ShoppingCart: {
        type: mongoose.Schema.Types.ObjectId || null,
        ref: 'shoppingCarts',
        default: null
    },
    favorite: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'products'
    },
    adress: {
        type: String,
    },
    phone: {
        type: Number,
    },
    activationToken: {
        type: Number,
    },
    token : {
        type: Number
    },
    verification: {
        type: Boolean,
        default: false
    },
    interrestedAbout: {
        type: String,
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

