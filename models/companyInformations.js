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
    email: {
        type: String,
    },
    password: {
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
    },
    socialMediaLinks: {

        facebook: {
            type: String,
        },
        messanger: {
            type: String,
        },
        whatsApp: {
            type: String,
        },
        instagram: {
            type: String,
        },
        x: {
            type: String,
        },
        youtube: {
            type: String,
        }
    },
    backgroundOfRegisterPage: {
        type: String,
    },
    registerRequiredData: {
        dateOfBearth: {
            type: Boolean,
        },
        phoneNumber: {
            type: Boolean,
        },
        adress: {
            type: Boolean,
        },
        interrestedAbout: {
            type: Boolean,
        }
    },
    activateAccountWhileSignin : {
        type: Boolean
    }

})

const CompanyInformations = mongoose.model('companyInformations', ConpanyInformationsShema);
module.exports = CompanyInformations;