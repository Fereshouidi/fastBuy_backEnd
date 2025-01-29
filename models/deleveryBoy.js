const mongoose = require('mongoose');
const { type } = require('os');
const bcrypt = require('bcrypt');


const DeleveryBoySchema = new mongoose.Schema({

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
    orders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'orders',
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
    timeOfRegister: {
        type: Date,
        default: Date.now,
    }
    
})

DeleveryBoySchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); 
    }
    next();
});

const DeleveryBoy = mongoose.model('deleveryBoys', DeleveryBoySchema);
module.exports = DeleveryBoy;

