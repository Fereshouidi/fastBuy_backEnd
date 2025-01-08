const express = require('express');
const connect = require('./connect');
const cors = require('cors');
const app = express();
const customerRouter = require('./routes/customer');
const productRouter = require('./routes/product');
const purchaseRouter = require('./routes/purchase');
const shoppingCartRouter = require('./routes/shoppingCart');
const bulletinBoardRouter = require('./routes/bulletinBoard');
const sliderRouter = require('./routes/slider');
const discount = require('./routes/discount');
const categorie = require('./routes/categorie');
const categoriesSection = require('./routes/categoriesSection');
const ConpanyInformations = require('./routes/companyInformation');
const dealingWithEmails = require('./routes/dealingWithEmails');
const order = require('./routes/order');
const discountCode = require('./routes/discoundCode');
const review = require('./routes/review');

const PORT = 3002 || process.env.PORT;

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.use(cors());
app.use(express.json());

app.use('/api', customerRouter);
app.use('/api', productRouter);
app.use('/api', purchaseRouter);
app.use('/api', shoppingCartRouter);
app.use('/api', bulletinBoardRouter);
app.use('/api', sliderRouter);
app.use('/api', discount);
app.use('/api', categorie);
app.use('/api', categoriesSection);
app.use('/api', ConpanyInformations);
app.use('/api', dealingWithEmails);
app.use('/api', order);
app.use('/api', discountCode);
app.use('/api', review);


app.listen(PORT, () => {
    console.log(`server is running at the port : ${PORT}`);
})