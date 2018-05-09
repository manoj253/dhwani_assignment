const mongoose = require('mongoose');
const config = require('../config/database');

const FormSchema = mongoose.Schema({
  name: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  remark: {
    type: String,
    required: true
  }
 
});

const Form = module.exports = mongoose.model('Form', FormSchema);