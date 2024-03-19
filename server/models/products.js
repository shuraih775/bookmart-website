const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    
    img:{
        data:Buffer,
        name:String,
        size: Number

    },
    name: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
