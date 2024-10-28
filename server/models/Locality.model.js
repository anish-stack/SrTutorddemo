const mongoose = require('mongoose');

const localitySchema = new mongoose.Schema({
  country: {
    type: String,
    default: 'IN'
  },
  pincode: {
    type: String
  },
  placename: {
    type: String
  },
  Districts: {
    type: String
  },
  unionterritories:{
    type: String
  },
  lat: {
    type: String
  },
  lng: {
    type: String
  }
});

module.exports = mongoose.model('Locality', localitySchema);
