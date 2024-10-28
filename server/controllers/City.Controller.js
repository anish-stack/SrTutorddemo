const cityModel = require("../models/City.model"); // Assuming the model is named 'City.model'
const streamifier = require("streamifier");
const Cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { ServerError, warn } = require('../utils/Logger');

// Configure Cloudinary
Cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// Helper function to upload image buffer to Cloudinary
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = Cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Create a new City (city)
exports.createCity = async (req, res) => {
  try {
    const { CityName } = req.body;
    const file = req.file;

    if (!file) {
      warn("No file uploaded for city creation", "City Controller", "createCity");
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const uploadResult = await uploadFromBuffer(file.buffer);
    const imageUrl = uploadResult.url;
    const public_id = uploadResult.public_id;

    const newCity = new cityModel({
      CityName,
      CityImage: {
        url: imageUrl,
        public_id: public_id,
      },
    });

    await newCity.save();

    res.status(201).json({
      success: true,
      data: newCity,
      message: "City created successfully",
    });
  } catch (error) {
    ServerError(`Error creating city: ${error.message}`, "City Controller", "createCity");
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update an existing City (city)
exports.updateCity = async (req, res) => {
  try {
    const { CityName } = req.body;
    const file = req.file;
    const { id } = req.params;

    const city = await cityModel.findById(id);
    if (!city) {
      warn(`City with ID ${id} not found for update`, "City Controller", "updateCity");
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    if (file) {
      try {
        // Delete the old image from Cloudinary
        await Cloudinary.uploader.destroy(city.CityImage.public_id);
      } catch (error) {
        ServerError(`Error deleting old image from Cloudinary: ${error.message}`, "City Controller", "updateCity");
      }

      // Upload the new image
      const uploadResult = await uploadFromBuffer(file.buffer);
      city.CityImage.url = uploadResult.url;
      city.CityImage.public_id = uploadResult.public_id;
    }

    city.CityName = CityName || city.CityName;

    await city.save();

    res.status(200).json({
      success: true,
      data: city,
      message: "City updated successfully",
    });
  } catch (error) {
    ServerError(`Error updating city: ${error.message}`, "City Controller", "updateCity");
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete a City (city)
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await cityModel.findById(id);
    if (!city) {
      warn(`City with ID ${id} not found for deletion`, "City Controller", "deleteCity");
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // Delete the image from Cloudinary
    try {
      await Cloudinary.uploader.destroy(city.CityImage.public_id);
    } catch (error) {
      ServerError(`Error deleting image from Cloudinary: ${error.message}`, "City Controller", "deleteCity");
    }

    // Delete the city from the database
    await city.deleteOne();

    res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    ServerError(`Error deleting city: ${error.message}`, "City Controller", "deleteCity");
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

// Get all Cities
exports.getAllCities = async (req, res) => {
  try {
    const cities = await cityModel.find();

    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    ServerError(`Error fetching cities: ${error.message}`, "City Controller", "getAllCities");
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
