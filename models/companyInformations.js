const mongoose = require('mongoose');

const ConpanyInformationsShema = new mongoose.Schema({
    name: {
        english : {
            type: String,
        },
        arabic : {
            type: String,
        }
    },
    logo: {
        type: String,
    },
    primaryColor: {
        type: String,
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'categories'
    },
    discounts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'discounts'
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'discounts'
    },
    country: {
        type: String,
    },
    Entities: {
        type: [String]
    },
    biggestDiscount: {
        type: Number,
    },
    offersDetails: {
        type: String,
    },
    originalProductsPercentage: {
        type: Number,
    },
    servises: {
        type: [String]
    }

})

const CompanyInformations = mongoose.model('companyInformations', ConpanyInformationsShema);
module.exports = CompanyInformations;