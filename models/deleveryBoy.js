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
        monday: [Number],
        tuesday: [Number],
        wednesday: [Number],
        thursday: [Number], 
        friday: [Number],
        saturday: [Number],
        sunday: [Number],
    },
    createdAt: {
        type: Date,
        default: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000),
    }
});

DeleveryBoySchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); 
    }
    next();
});

const DeleveryBoy = mongoose.model('DeleveryBoy', DeleveryBoySchema);
module.exports = DeleveryBoy;
