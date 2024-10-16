const mongoose = require("mongoose");

// Define the Class schema
const ClassSchema = new mongoose.Schema(
  {
    Class: {
      type: String,
      required: true,
      trim: true,
    },
    InnerClasses: [
      {
        InnerClass: {
          type: String
        },
      },
    ],
    Icons: {
      url: {
        type: String,
        required: true,
      },
      Public_id: {
        type: String,
        required: true,
      },
    },
    Subjects: [
      {
        SubjectName: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create the Class model
const Class = mongoose.model("Class", ClassSchema);

module.exports = Class;
