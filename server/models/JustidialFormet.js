const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadid: {
    type: String,
   
  },
  leadtype: {
    type: String,
   
  },
  prefix: {
    type: String,
   
  },
  name: {
    type: String,
   
  },
  mobile: {
    type: String
    },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
   
  },
  city: {
    type: String,
   
  },
  area: {
    type: String,
   
  },
  brancharea: {
    type: String
  },
  dncmobile: {
    type: Number   
  },
  dncphone: {
    type: Number   
  },
  company: {
    type: String
  },
  pincode: {
    type: String
  },
  time: {
    type: String
  },
  branchpin: {
    type: String
  },
  parentid: {
    type: String
  }
});

module.exports = mongoose.model('Lead', leadSchema);
