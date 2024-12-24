const mongoose = require("mongoose");

const DiscountCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    target: {
        type: [String], 
        enum: ['shoppingCart', 'product', 'categorie'], 
    },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    shoppingCart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shoppingCarts'
    },
    discountPercent: { 
        type: Number || null,
        default: null
    },
    discount: { 
        type: Number || null,
        default: null
    },
});

const DiscountCode = mongoose.model('discountCodes', DiscountCodeSchema);

module.exports = DiscountCode;
