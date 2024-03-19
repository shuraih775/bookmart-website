const mongoose = require('mongoose');

const uploadedSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        ref:"users",
        trim: true 
      },
    files: [{
        data: Buffer, 
        contentType: String,
        name:String, 
        size: Number 
    }],
    uploadDate: {
        type: Date,
        default: Date.now
    },
    transactionId: {
        type: String,
        ref:'Transaction',
        unique: true
    }
    
});

const uploadedfiles = mongoose.model('uploadedfiles', uploadedSchema);

module.exports = uploadedfiles;
