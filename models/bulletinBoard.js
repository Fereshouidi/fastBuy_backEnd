const mongoose = require('mongoose');

const BullentinBoardShema = new mongoose.Schema({
    name: {
        english: {
            type: String,
            default: 'bullentinBoard'
        }, 
        arabic: {
            type: String,
            default: 'bullentinBoard'
        }
    },
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

