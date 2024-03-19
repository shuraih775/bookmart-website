const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');
const uploadRoute = require('./routes/upload');
const authroute = require('./routes/auth');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/orders');

const bodyParser = require('body-parser');
app.use(cors());
// Set the limit to 50 MB (for example)
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
 
connectDB();




app.use(express.json());


app.use('/api/auth', authroute);
app.use('/api/upload',uploadRoute);
app.use('/api/product',productRoute);
app.use('/api/orders',orderRoute);

module.exports = app;
