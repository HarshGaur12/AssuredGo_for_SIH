const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  BranchName:{
    type: String,
    required:true
  },
  Details: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  organizationType: {
    type: String,
    enum: ['Hospital', 'Police'], 
  },
  

});

const User = mongoose.model('User', userSchema);

module.exports = User;
