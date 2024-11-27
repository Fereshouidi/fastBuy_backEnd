const express = require('express');
const connect = require('./connect');
const cors = require('cors');
const app = express();
const customerRouter = require('./routes/customer');
const productRouter = require('./routes/product');
const purchaseRouter = require('./routes/purchase');
const shoppingCartRouter = require('./routes/shoppingCart');

const PORT = 3002 || process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api', customerRouter);
app.use('/api', productRouter);
app.use('/api', purchaseRouter);
app.use('/api', shoppingCartRouter);


app.listen(PORT, () => {
    console.log(`server is running at the port : ${PORT}`);
})