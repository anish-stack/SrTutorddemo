const mongoose = require('mongoose');

const NewsLetterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

const NewsLetter = mongoose.model('NewsLetter', NewsLetterSchema);

module.exports = NewsLetter;
