const mongoose = require('mongoose');

const uri = 'mongodb+srv://feres997:feres997@cluster0.peiowiq.mongodb.net/fast_buy';

const connect = mongoose.connect(uri)
.then(() => {
    console.log('database connect!');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

module.exports = connect;
