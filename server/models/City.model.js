const mongoose = require('mongoose');

// Define the City schema
const CitySchema = new mongoose.Schema({
    CityName: {
        type: String,
        required: true,
        trim: true
    },
    CityImage: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

// Create the City model
const City = mongoose.model('City', CitySchema);

module.exports = City;
