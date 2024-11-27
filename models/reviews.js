const mongoose = require("mongoose");
const Product = require("./product");

const ReviewShema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
    },
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    customerRating: {
        type: Number,
        unum: [0,1,2,3,4,5],
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