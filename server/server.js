const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/db");
const PORT = process.env.PORT || 5000;
const app = express();
const StudentRouter = require("./routes/Student.routes");
const AdminRouter = require("./routes/Admin.routes");
const TeacherRouter = require("./routes/Teacher.routes");
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_PORT || 6379);

(async () => {
  redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
  });
  redisClient.on("ready", () => console.log("Redis is ready"));

  const redis = await redisClient.connect();
  app.locals.redis = redis;
  await redisClient.ping();
})();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  redirect: true,
};
app.use(cors(corsOptions));
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
  } catch (error) {
    console.error("Error flushing Redis cache:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while clearing the Redis cache.",
      error: error.message,
    });
  }
});

app.use("/api/v1/student", StudentRouter);
app.use("/api/v1/teacher", TeacherRouter);
app.use("/api/v1/admin", AdminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server Is Running ${PORT}`);
});
