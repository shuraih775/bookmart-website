// Import mongoose
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures emails are unique in the database
    trim: true, // Removes whitespace from the beginning and end of email
    lowercase: true // Converts email to lowercase
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique in the database
    trim: true // Removes whitespace from the beginning and end of username
  },
  password: {
    type: String,
    required: true
  },
  isAdmin:{
    type:Boolean,
    required :true
  }
});

// Create and export the User model
const users = mongoose.model('users', userSchema);
module.exports = users;
