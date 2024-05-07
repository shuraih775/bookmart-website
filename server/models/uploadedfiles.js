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
    Color:{
        type:String
    },
    isReport:{
        type:String
    },
    department:{
        type:String
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
    
    
});

const uploadedfiles = mongoose.model('uploadedfiles', uploadedSchema);

module.exports = uploadedfiles;
