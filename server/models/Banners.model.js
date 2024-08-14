const mongoose = require('mongoose');

// Define the Banner schema
const BannerSchema = new mongoose.Schema({
    Banner: {
        url: {
            type: String,
            required: true,
        }
    },
    ButtonText: {
        type: String,
    },
    RedirectPageUrl: {
        type: String
    },
    Position:{
        type: String
    },
    isActive: {
        type: String,
        default: true
    }
}, { timestamps: true });

// Create the Banner model
const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;
