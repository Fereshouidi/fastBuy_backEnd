const mongoose = require("mongoose");
const Product = require("./product");

const ReviewShema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    customerRating: {
        type: Number,
        default: null,
        unum: [null, 0,5, 1 ,1.5 ,2 ,2.5, 3, 3.5, 4, 4.5,  5],
    },
    customerNote:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date,
    }
})


const Review = mongoose.model('reviews', ReviewShema);
module.exports = Review;