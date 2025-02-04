const mongoose = require('mongoose');
const { type } = require('os');
const bcrypt = require('bcrypt');
const ShoppingCart = require('./shoppingCart');
const { verify } = require('crypto');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    dateOfBirth: {
        type: Date
    },
    password: {
        type: String
    },
    retypePassword: {
        type: String
    },
    token: {
        type: Number
    },
    verification: {
        type: Boolean,
        default: false
    },
    permessions: {
        type: [String],
        unum: ['statistics', 'productsManagement', 'ordersManegment', 'adminsManegement', 'customersManegment']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


AdminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); 
    }
    next();
});

const Admin = mongoose.model('Admins', AdminSchema);
module.exports = Admin;