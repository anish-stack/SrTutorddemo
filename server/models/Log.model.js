// models/Log.model.js

const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  stack: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ["error", "info", "warn"],
    default: "error"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const LogModel = mongoose.model("Log", logSchema);

module.exports = LogModel;
