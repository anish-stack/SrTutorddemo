const mongoose = require('mongoose');

const NewsLetterTemplateSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

const NewsLetterTemplate = mongoose.model('NewsLetterTemplate', NewsLetterTemplateSchema);

module.exports = NewsLetterTemplate;
