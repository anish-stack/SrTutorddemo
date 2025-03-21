const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const SeoPagesSchema = new mongoose.Schema(
    {
        MetaTitle: {
            type: String,
            required: true,
            trim: true,
          
        },
        MetaDescription: {
            type: String,
            trim: true,
          
        },
        MetaKeywords: {
            type: [String]
           
        },
        PageTitle: {
            type: String,
            required: true,
            trim: true,
        },
        Heading: {
            type: String,
            required: true,
            trim: true,
        },
        Tag: {
            type: String,
            default: 'SR Tutor is India’s leading education service provider portal.',
        },
        seoFrendilyUrl:{
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return /^[a-z0-9-]+$/.test(v);
                },
                message: 'SEO Frendily URL can only contain lowercase letters, numbers, and hyphens.',
            },
        },
        PageContent: {
            type: String,
            required: true,
           
               
        },
    },
    { timestamps: true }
);




module.exports = mongoose.model('SeoPage', SeoPagesSchema);
