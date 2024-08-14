const streamifier = require('streamifier');
const Cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
Cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});

const Blogs = require('../models/Blog.model');
exports.createBlog = async (req, res) => {
    try {
        // console.log("image",req.file)
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

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
        const thumbnailUrl = uploadResult.url;

        // Destructure the request body
        const { CreatedBy, Headline, Tag, SubHeading, BlogData } = req.body;

        // Create a new Blog document
        const Blog = new Blogs({
            CreatedBy,
            Headline,
            ImageOfBlog: thumbnailUrl,
            SubHeading,
            BlogData,
            Tag,
        });

        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        // Invalidate the cache
        await redisClient.del('blogs');

        // Save the new blog to the database
        await Blog.save();

        // Return a success response
        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: Blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create Blog',
            error: error.message,
        });
    }
};

// Delete a Blog
exports.DeleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const Blog = await Blogs.findByIdAndDelete(id);

        if (!Blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('blogs');
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Blog', error });
    }
};

// Get All Blog
exports.getAllBlog = async (req, res) => {
    try {
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        // Try to get the data from Redis cache
        const cachedBlogs = await redisClient.get('blogs');

        if (cachedBlogs) {
            // If data is found in cache, return it
            return res.status(200).json({
                success: true,
                message: 'Blogs retrieved successfully from cache',
                data: JSON.parse(cachedBlogs)
            });
        }

        // If data is not found in cache, fetch it from the database
        const BlogList = await Blogs.find();

        // Cache the result in Redis for future requests
        await redisClient.setEx('blogs', 3600, JSON.stringify(BlogList)); // Cache for 1 hour

        // Return the fetched data
        res.status(200).json({
            success: true,
            message: 'Blogs retrieved successfully from the database',
            data: BlogList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
            error: error.message
        });
    }
};

// Get a Single Blog
exports.getSingleBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            return res.status(500).json({
                success: false,
                status: 'error',
                message: 'Redis client is not available.',
            });
        }

        // Check cache first
        const cacheKey = `blogs_${id}`;
        const cachedBlog = await redisClient.get(cacheKey);

        if (cachedBlog) {
            return res.status(200).json({
                success: true,
                status: 'success',
                message: 'Blog retrieved successfully from cache',
                data: JSON.parse(cachedBlog),
            });
        }

        // If not found in cache, fetch from database
        const Blog = await Blogs.findById(id);

        if (!Blog) {
            return res.status(404).json({
                success: false,
                status: 'error',
                message: 'Blog not found',
            });
        }

        // Cache the result for future requests
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(Blog)); // Cache for 1 hour

        // Return the fetched data
        res.status(200).json({
            success: true,
            status: 'success',
            message: 'Blog retrieved successfully from the database',
            data: Blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Failed to fetch Blog',
            error: error.message,
        });
    }
};


exports.UpdateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;

        let thumbnailUrl;

        // If a new file is provided, upload it to Cloudinary
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
            thumbnailUrl = uploadResult.url;
        }

        const { CreatedBy, Headline, SubHeading, DateOfBlog, BlogData } = req.body;

        // Update the blog entry, including the new image URL if applicable
        const updateData = {
            CreatedBy,
            Headline,
            SubHeading,
            DateOfBlog,
            BlogData,
        };

        // If a new image was uploaded, include it in the update
        if (thumbnailUrl) {
            updateData.ImageOfBlog = thumbnailUrl;
        }

        const updatedBlog = await Blogs.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        await redisClient.del('blogs');
        await redisClient.del(`blogs_${id}`);
        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update blog',
            error: error.message,
        });
    }
};