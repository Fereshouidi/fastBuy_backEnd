const mongoose = require('mongoose');

const SliderShema = new mongoose.Schema({
    tittle: {
        type: String,
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'products',
    },
    changingTime: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Slider = mongoose.model('slider', SliderShema);
module.exports = Slider;