const mongoose = require('mongoose');

// Define the HeroBanner schema
const HeroBannerSchema = new mongoose.Schema({
    HeroBanner: {
        url: {
            type: String,
            required: true,
        },
        Public_id: {
            type: String,
            required: true,
        }
    },
    isActive: {
        type: String,
        default: true
    }
}, { timestamps: true });

// Create the HeroBanner model
const HeroBanner = mongoose.model('HeroBanner', HeroBannerSchema);

module.exports = HeroBanner;
