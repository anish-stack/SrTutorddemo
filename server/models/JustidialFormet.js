const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadid: {
    type: String,
    unique: true,
    required: true
  },
  leadtype: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    enum: ['Mr', 'Ms', 'Dr'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
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
    required: true
  },
  city: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  brancharea: {
    type: String
  },
  dncmobile: {
    type: Number,
    enum: [0, 1],
    required: true
  },
  dncphone: {
    type: Number,
    enum: [0, 1],
    required: true
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
