const axios = require('axios');

const Geocode = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: "AIzaSyCBATa-tKn2Ebm1VbQ5BU8VOqda2nzkoTU"
            },
        });

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            const lat = location.lat;
            const lng = location.lng;

            const data = {
                latitude: lat,
                longitude: lng,
                formatted_address: response.data.results[0].formatted_address,
                place_id: response.data.results[0].place_id, // Adding Place ID for better identification
            };
            return data;
        } else {
            throw new Error(`Geocoding failed with status: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching geocoding data:', error.message);
        throw new Error('Failed to fetch geocoding data. Please check the address or API key.');
    }
};

module.exports = Geocode;
