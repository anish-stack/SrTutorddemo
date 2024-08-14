const bannerModel = require('../models/Banners.model')
const HeroBanner = require('../models/Hero.Banner.model')
const streamifier = require('streamifier');
const Cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
Cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});


exports.createBanner = async (req, res) => {
    try {
        const { ButtonText, active, RedirectPageUrl, Position } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }
        const checkPosition = await bannerModel.find({ Position })
        console.log(checkPosition)
        if (checkPosition.length === 0) {
            // Function to upload image using buffer
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

            // Upload the image and get the URL
            const uploadResult = await uploadFromBuffer(file.buffer);
            const imageUrl = uploadResult.url;

            // Check if banner with the same ButtonText already exists


            // Create new banner object
            const newBanner = new bannerModel({
                ButtonText,
                active,
                RedirectPageUrl,
                Position,
                Banner: {
                    url: imageUrl
                }
            });

            // Save new banner to database
            await newBanner.save();

            // Respond with success message and new banner data
            res.status(201).json({
                success: true,
                data: newBanner,
                message: 'Banner created successfully'
            });

        }

    } catch (error) {
        console.error('Error creating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.ChangePosition = async (req, res) => {
    try {
        const id = req.params.id
        const { newPosition } = req.body
        if (!newPosition) {
            return res.status(400).json({
                success: false,
                message: 'No Position Provided',
            });
        }
        const checkBanner = await bannerModel.findById(id)
        if (!checkBanner) {
            return res.status(403).json({
                success: false,
                message: "Banner Not Found With this Id"
            })
        }
        const checkPosition = await bannerModel.find({ Position: newPosition })
        // console.log(checkPosition)
        if (checkPosition.length > 0) {
            return res.status(403).json({
                success: false,
                message: `${newPosition} Position is Already in Use`
            })
        }

        //if all good then change Position
        checkBanner.Position = newPosition

        await checkBanner.save()
        res.status(201).json({
            success: true,
            message: 'Position Change Successful',
        });

    } catch (error) {
        res.status(501).json({
            success: false,
            message: 'Error in  Change Position',
            error: error.message
        });
    }
}

exports.getAllBanner = async (req, res) => {
    try {
        const getAllBanner = await bannerModel.find();
        if (getAllBanner === 0) {
            return res.status(400).json({
                success: false,
                msg: "Banner Not Avilable Now"
            })
        }
        res.status(201).json({
            success: true,
            data: getAllBanner,
            msg: "All Banner Found"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.deleteBanner = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id)
        const checkBanner = await bannerModel.findByIdAndDelete({ _id: id })
        // console.log(checkBanner)
        if (!checkBanner) {
            return res.status(403).json({
                success: false,
                msg: "Banner Not Found"
            })
        }
        const pastImageUrl = checkBanner.Banner.url;
        const publicId = pastImageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL

        // Destroy the old image in Cloudinary
        await Cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error("Error in deleting old image:", error);
            } else {
                console.log("Old image deleted:", result);
            }
        });

        res.status(200).json({
            success: true,
            msg: "Banner Deleted Successfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.updateBanner = async (req, res) => {
    try {
        const BannerId = req.params.id;
        const updates = { ...req.body }; // Spread to make a shallow copy of req.body
        const file = req.file;
        const banner = await bannerModel.findById(BannerId)
        if (!banner) {
            return res.status(403).json({
                success: false,
                message: "This Banner Details Is Not Available"
            })
        }

        if (file) {
            // Function to upload image using buffer
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

            // Upload the image and get the URL
            const uploadResult = await uploadFromBuffer(file.buffer);

            const imageUrl = uploadResult.secure_url;
            if (!imageUrl) {
                return res.status(403).json({
                    success: false,
                    message: "Error in Uploading Image At Cloudinary"
                })
            }
            else {
                //destroy the past image 

                const pastImageUrl = banner.Banner.url;
                const publicId = pastImageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL

                // Destroy the old image in Cloudinary
                await Cloudinary.uploader.destroy(publicId, (error, result) => {
                    if (error) {
                        console.error("Error in deleting old image:", error);
                    } else {
                        console.log("Old image deleted:", result);
                    }
                });

                // Add the new image URL to updates
                updates.Banner = { url: imageUrl };
            }
            // Add the image URL to updates
            updates.Banner = { url: imageUrl };
        }

        // Find the banner by ID and update it with new data
        const updatedBanner = await bannerModel.findByIdAndUpdate(BannerId, updates, { new: true });

        if (!updatedBanner) {
            return res.status(404).json({
                success: false,
                msg: "Banner not found."
            });
        }

        res.status(200).json({
            success: true,
            msg: "Banner updated successfully.",
            data: updatedBanner
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};