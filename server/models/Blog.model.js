const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    CreatedBy: {
        type: String,
        required: true
    },
    ImageOfBlog: {
        type: String,
    },
    Headline: {
        type: String,
        required: true
    },
    SubHeading: {
        type: String,
        required: true
    },
    DateOfBlog: {
        type: Date,
        default: Date.now
    },
    Tag: {
        type: String
    },
    BlogData: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
