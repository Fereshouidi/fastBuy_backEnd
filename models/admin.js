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
    permissions: {
        type: [String],
        unum: ['statistics', 'productsManagement', 'ordersManegment', 'adminsManagement', 'customersManegment', 'companyManagement']
    },
    timeTable: {
        monday: [{
            hour: { type: Number, default: null },
            role: { type: String, default: null }
        }],
        tuesday: [{
            hour: { type: Number, default: null },
            role: { type: String, default: null }
        }],
        wednesday: [{
            hour: { type: Number, default: null },
            role: { type: String, default: null }
        }],
        thursday: [{
            hour: { type: Number, default: null },
            role: { type: String, default: null }
        }],
        friday: [{
            hour: { type: Number, default: null },
            role: { type: String, default: null }
        }],
        saturday: [{
            hour: { type: Number, default: null },
            role: { type: String, default: null }
        }],
        sunday: [{
            hour: { type: Number, default: null },
            role: { type: String, default: null }
        }],
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