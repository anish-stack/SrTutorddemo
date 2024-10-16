const CatchAsync = require('../utils/CatchAsync');
const Cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
Cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});

// Function to upload a single image
const uploadSingleImage = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = Cloudinary.uploader.upload_stream(
            { folder: process.env.CLOUDINARY_FOLDER_NAME }, // Specify the folder name here
            (error, result) => {
                if (result) {
                    resolve({ public_id: result.public_id, imageUrl: result.secure_url });
                } else {
                    reject(error || new Error("Failed to upload image"));
                }
            }
        );
        stream.end(fileBuffer);
    });
};

// Function to handle single image upload request
const UploadSingleImage = CatchAsync(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded",
        });
    }

    const fileBuffer = req.file.buffer;
    const uploadResult = await uploadSingleImage(fileBuffer);
    
    res.status(200).json({
        success: true,
        data: uploadResult
    });
});

// Function to handle multiple images upload request
const UploadMultipleImages = CatchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No files uploaded",
        });
    }

    const fileBuffers = req.files.map(file => file.buffer);
    const uploadPromises = fileBuffers.map(fileBuffer => uploadSingleImage(fileBuffer));
    const uploadResults = await Promise.all(uploadPromises);
    
    res.status(200).json({
        success: true,
        data: uploadResults
    });
});

module.exports = {
    UploadSingleImage,
    UploadMultipleImages
};
