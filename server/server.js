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
const connectDb = require('./config/db');
const { info, error } = require('./utils/Logger');
const redis = require("redis");
const universal = require("./routes/universal.routes");
const axios = require('axios')
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
    "https://www.srtutors.hoverbusinessservices.com",
    "https://www.sradmin.hoverbusinessservices.com",
    "https://srtutors.hoverbusinessservices.com",
    "https://sradmin.hoverbusinessservices.com",
    "www.srtutorsbureau.com",
    "https://www.srtutorsbureau.com",
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
                    key: "AIzaSyBQ-6XL1bXfYt7_7inMBOFXLg5Zmram81o"
                }
            }
        );
        res.json(response.data.predictions);
    } catch (error) {
        console.error('Error making Google API request:', error);
        res.status(500).send('Server error');
    }
});


app.get('/geocode', async (req, res) => {
    const { address } = req.query; // Get address from query parameters

    if (!address) {
        return res.status(400).send({ error: 'Address is required' });
    }

    try {
        // Make a request to Google Geocoding API
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: "AIzaSyBQ-6XL1bXfYt7_7inMBOFXLg5Zmram81o"
            },
        });

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
    error(`Unhandled Error: ${err.message}`, 'ErrorHandler', 'GlobalErrorHandler');
    if (!res.headersSent) {
        res.status(500).send("Something went wrong!");
    }
});

app.listen(PORT, () => {
    info(`Server is running on port ${PORT}`, 'Server', 'Startup');
});
