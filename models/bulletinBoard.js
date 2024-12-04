const mongoose = require('mongoose');

const BullentinBoardShema = new mongoose.Schema({
    images: {
        type: [String],
    },
    changingTime: {
        type: Number,
    },
    link: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


const BullentinBoard = mongoose.model('bullentinsBoard', BullentinBoardShema);
module.exports = BullentinBoard;

