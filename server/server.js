const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const app = express();
const StudentRouter = require("./routes/Student.routes");
const AdminRouter = require("./routes/Admin.routes");
const TeacherRouter = require("./routes/Teacher.routes");
const leadRoutes = require('./routes/Jd.routes');

const connectDb = require('./config/db');
const { info, error } = require('./utils/Logger');
const redis = require("redis");
const universal = require("./routes/universal.routes");
const axios = require('axios');
const SendWhatsAppMessage = require("./utils/SendWhatsappMeg");
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

(async () => {
    redisClient.on("error", (err) => {
        error("Failed to connect to Redis", 'Redis', 'Connection');
    });

    redisClient.on("ready", () => console.log("Redis is ready"));

    try {
        await redisClient.connect();
        await redisClient.ping();
        app.locals.redis = redisClient;
    } catch (err) {
        error("Redis connection error", 'Redis', 'Connection');
    }
})();

// CORS Configuration
const allowedOrigins = [
    "https://www.srtutorsbureau.com",
    "https://www.admin.srtutorsbureau.com",
    "https://admin.srtutorsbureau.com",
    "https://srtutorsbureau.com",
    "https://www.srtutors.hoverbusinessservices.com",
    "https://www.sradmin.hoverbusinessservices.com",
    "https://srtutors.hoverbusinessservices.com",
    "https://sradmin.hoverbusinessservices.com",
    'http://localhost:3001',
    'http://localhost:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to database
connectDb();

// Routes
app.get("/", (req, res) => {
    res.send("Hello World I am From Sr Tutors 📖📖!");
});

app.get("/Flush-all-Redis-Cached", async (req, res) => {
    try {
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            return res.status(500).json({
                success: false,
                message: "Redis client is not available.",
            });
        }

        await redisClient.flushAll(); // Flush all the Redis data
        res.redirect("/");
    } catch (err) {
        error("Error flushing Redis cache: " + err.message, 'Redis', 'Flush Cache');
        res.status(500).json({
            success: false,
            message: "An error occurred while clearing the Redis cache.",
            error: err.message,
        });
    }
});

app.post('/Fetch-Current-Location', async (req, res) => {
    const { lat, lng } = req.body;

    // Check if latitude and longitude are provided
    if (!lat || !lng) {
        return res.status(400).json({
            success: false,
            message: "Latitude and longitude are required",
        });
    }

    try {
        // Check if the Google Maps API key is present
        if (!process.env.GOOGLE_MAP_KEY) {
            return res.status(403).json({
                success: false,
                message: "API Key is not found"
            });
        }

        // Fetch address details using the provided latitude and longitude
        const addressResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAP_KEY}`
        );
        
        // Check if any results are returned
        if (addressResponse.data.results.length > 0) {
            const addressComponents = addressResponse.data.results[0].address_components;
            // console.log(addressComponents)
   
            let city = null;
            let area = null;
            let postalCode = null;
            let district = null;

            // Extract necessary address components
            addressComponents.forEach(component => {
                if (component.types.includes('locality')) {
                    city = component.long_name; 
                } else if (component.types.includes('sublocality_level_1')) {
                    area = component.long_name; 
                } else if (component.types.includes('postal_code')) {
                    postalCode = component.long_name; 
                } else if (component.types.includes('administrative_area_level_3')) {
                    district = component.long_name; // Get district
                }
            });

            // Prepare the address details object
            const addressDetails = {
                completeAddress: addressResponse.data.results[0].formatted_address,
                city: city,
                area: area,
                district: district,
                postalCode: postalCode,
                landmark: null, // Placeholder for landmark if needed
                lat: addressResponse.data.results[0].geometry.location.lat,
                lng: addressResponse.data.results[0].geometry.location.lng,
            };

            console.log("Address Details:", addressDetails);

            // Respond with the location and address details
            return res.status(200).json({
                success: true,
                data: {
                    location: { lat, lng },
                    address: addressDetails,
                },
                message: "Location fetch successful"
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No address found for the given location",
            });
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch address",
        });
    }
});




app.use('/api/jd', leadRoutes);
app.use("/api/v1/student", StudentRouter);
app.use("/api/v1/teacher", TeacherRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/uni", universal);

app.get('/autocomplete', async (req, res) => {
    try {
        const { input } = req.query;
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
            {
                params: {
                    input,
                    radius: 500,
                    key: process.env.GOOGLE_MAP_KEY
                }
            }
        );
        res.json(response.data.predictions);
    } catch (error) {
        console.error('Error making Google API request:', error);
        res.status(500).send('Server error');
    }
});

app.get('/nearby-places', async (req, res) => {
    const { lat, lng, radius, pagetoken } = req.query;
    console.log(req.query);
    const apiKey = process.env.GOOGLE_MAP_KEY;
    if (!lat || !lng || !radius) {
        return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    const metersRadius = radius;
    console.log(metersRadius);

    // Include pagetoken if provided
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${metersRadius}&sensor=false&key=${apiKey}&rankby=prominence&maxResults=50${pagetoken ? `&pagetoken=${pagetoken}` : ''}`;

    try {
        const response = await axios.get(apiUrl);

        // Extract places    
        const places = response.data.results.map(place => ({

            name: place.name,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            address: place.vicinity
        }));

        return res.status(201).json({
            success: true,

            FilterData: places
        })
    } catch (error) {
        console.error('Error fetching places from Google API:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Error fetching data from Google Places API.' });
    }
});

app.get('/geocode', async (req, res) => {
    const { address } = req.query; // Get address from query parameters

    if (!address) {
        return res.status(400).send({ error: 'Address is required' });
    }

    try {
        // console.log(process.env.GOOGLE_MAP_KEY)
        // Make a request to Google Geocoding API
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: "AIzaSyCBATa-tKn2Ebm1VbQ5BU8VOqda2nzkoTU"
            },
        });
        console.log(response.data)
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            const lat = location.lat;
            const lng = location.lng;

            // Send the lat and lng back to the client
            res.json({
                latitude: lat,
                longitude: lng,
                formatted_address: response.data.results[0].formatted_address,
            });
        } else {
            res.status(404).json({ error: 'No results found for the provided address' });
        }
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        res.status(500).send({ error: 'Server error' });
    }
});

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        for (const field in err.errors) {
            error(`Validation Error on field '${field}': ${err.errors[field].message}`, 'ErrorHandler', 'ValidationError');
        }
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.errors,
        });
    }
    // Log general errors
    // error(`Unhandled Error: ${err.message}`, 'ErrorHandler', 'GlobalErrorHandler');
    if (!res.headersSent) {
        res.status(500).send("Something went wrong!");
    }
});

app.listen(PORT, () => {
    info(`Server is running on port ${PORT}`, 'Server', 'Startup');
});
