const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

// Define the schema
const particularTeacherSchema = new mongoose.Schema({
  ClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
  Gender: {
    type: String,
    enum: ['Male', 'Female', 'Any'],
    required: true,
  },
  Location: {
    type: String,
    trim: true,
    set: (v) => sanitizeHtml(v),
    required: true,
  },
  MaxRange: {
    type: Number,
    min: 0,
    required: true,
  },
  MinRange: {
    type: Number,
    min: 0,
    required: true,
  },
  SpecificRequirement: {
    type: String,
    trim: true,
    set: (v) => sanitizeHtml(v),
  },
  StartDate: {
    type: Date,
    required: true,
  },
  Subject: [{
    type: String,
    trim: true,
    set: (v) => sanitizeHtml(v),
    required: true,
  }],
  TeachingExperience: {
    type: String,
    trim: true,
    set: (v) => sanitizeHtml(v),
    required: true,
  },
  TeachingMode: {
    type: String,
    required: true,
  },
  VehicleOwned: {
    type: String,
  },
  className: {
    type: String,
    trim: true,
    set: (v) => sanitizeHtml(v),
  },
  isBestFaculty: {
    type: Boolean,
    default: false,
  },
  latitude: {
    type: String,
    set: (v) => sanitizeHtml(v),
    trim: true,
  },
  longitude: {
    type: String,
    trim: true,
    set: (v) => sanitizeHtml(v)
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  HowManyClassYouWant: {
    type: String,
    trim: true,
  },
  commentByAdmin: [
    {
      comment: {
        type: String,
        set: (v) => sanitizeHtml(v),
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isDealDone: {
    type: Boolean,
    default: false,
  },
  statusOfRequest: {
    type: String,
    default: 'pending',
    enum: ['pending', 'declined', 'Accept'],
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }
}, { timestamps: true });

// Create the model
const ParticularTeacher = mongoose.model('ParticularTeacher', particularTeacherSchema);


module.exports = ParticularTeacher;
