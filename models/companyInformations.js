const mongoose = require('mongoose');
const { type } = require('os');

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
    shippingCost: {
        type: Number,
        default: 0
    },
    Entities: {
        english: {
            type: String
        },
        arabic: {
            type: String
        }
    },
    biggestDiscount: {
        type: Number,
    },
    offersDetails: {
        english: {
            type: String
        },
        arabic: {
            type: String
        }
    },
    qualityAssurance: {
        english: {
            type: String
        },
        arabic: {
            type: String
        }
    },
    originalProductsPercentage: {
        type: Number,
    },
    servises: {
        english: {
            type: String
        },
        arabic: {
            type: String
        }
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
    backgroundsPages: {

        homePage: {
            type: String,
        },
        registerPage: {
            type: String,
        },
        accountPage: {
            type: String,
        },
        ordersPage: {
            type: String,
        },
        shoppingCartPage: {
            type: String,
        }
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
    },
    currencyType: {
        type: String,
    },

})

const CompanyInformations = mongoose.model('companyInformations', ConpanyInformationsShema);
module.exports = CompanyInformations;