const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const DeleveryBoySchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    activationToken: {
        type: String,
    },
    token: {
        type: String
    },
    verification: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['employee', 'freelancer']
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
        default: Date.now,    
    },
});

DeleveryBoySchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); 
    }
    next();
});

const DeleveryBoy = mongoose.model('DeleveryBoys', DeleveryBoySchema);
module.exports = DeleveryBoy;
