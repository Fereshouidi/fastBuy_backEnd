const mongoose = require('mongoose');

const DiscountSchema = ({
    productId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'products'
    },
    percentage: {
        type: Number,
    },
    oldPrice: {
        type: Number,
    },
    newPrice: {
        type: Number,
    },
    discountSticker: {
        type: String,
    },
    startOfDiscount: {
        type: Date,
    },
    endOfDiscount: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: new Date
    },
})


const Discount = mongoose.model('discounts', DiscountSchema);
module.exports = Discount;