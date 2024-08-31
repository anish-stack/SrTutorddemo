const streamifier = require('streamifier');
const Cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { info, ServerError, warn } = require('../utils/Logger');


// Configure Cloudinary
Cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});

const Blogs = require('../models/Blog.model');
exports.createBlog = async (req, res) => {
    try {
        // info('Request received to create a new blog', 'Blog Controller', 'createBlog');

        const file = req.file;

        if (!file) {
            warn('No file uploaded with the request', 'Blog Controller', 'createBlog');
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

        // info('Uploading image to Cloudinary', 'Blog Controller', 'createBlog');

        // Upload the image and get the URL
        const uploadResult = await uploadFromBuffer(file.buffer);
        const thumbnailUrl = uploadResult.url;

        // info('Image uploaded successfully', 'Blog Controller', 'createBlog');

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
            warn('Redis client is not available, unable to invalidate cache', 'Blog Controller', 'createBlog');
            throw new Error('Redis client is not available.');
        }

        // info('Invalidating cache for blogs', 'Blog Controller', 'createBlog');

        // Invalidate the cache
        await redisClient.del('blogs');

        // Save the new blog to the database
        await Blog.save();

        info('Blog created and saved successfully', 'Blog Controller', 'createBlog');

        // Return a success response
        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: Blog,
        });

    } catch (error) {
        ServerError(`Error occurred while creating blog: ${error.message}`, 'Blog Controller', 'createBlog');

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
        // info('Request received to delete a blog', 'Blog Controller', 'DeleteBlog');

        const { id } = req.params;
        const Blog = await Blogs.findByIdAndDelete(id);

        if (!Blog) {
            warn(`Blog with ID ${id} not found`, 'Blog Controller', 'DeleteBlog');
            return res.status(404).json({ message: 'Blog not found' });
        }

        // info(`Blog with ID ${id} deleted successfully from the database`, 'Blog Controller', 'DeleteBlog');

        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            warn('Redis client is not available, unable to invalidate cache', 'Blog Controller', 'DeleteBlog');
            throw new Error('Redis client is not available.');
        }

        // info('Invalidating cache for blogs after deletion', 'Blog Controller', 'DeleteBlog');
        await redisClient.del('blogs');

        res.status(200).json({ message: 'Blog deleted successfully' });

    } catch (error) {
        ServerError(`Error occurred while deleting blog: ${error.message}`, 'Blog Controller', 'DeleteBlog');
        
        res.status(500).json({ message: 'Failed to delete Blog', error: error.message });
    }
};
// Get All Blog
exports.getAllBlog = async (req, res) => {
    try {
        // info('Request received to get all blogs', 'Blog Controller', 'getAllBlog');

        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            warn('Redis client is not available, proceeding without cache', 'Blog Controller', 'getAllBlog');
            throw new Error('Redis client is not available.');
        }

        // Try to get the data from Redis cache
        const cachedBlogs = await redisClient.get('blogs');

        if (cachedBlogs) {
            info('Blogs retrieved successfully from cache', 'Blog Controller', 'getAllBlog');
            return res.status(200).json({
                success: true,
                message: 'Blogs retrieved successfully from cache',
                data: JSON.parse(cachedBlogs)
            });
        }

        // If data is not found in cache, fetch it from the database
        const BlogList = await Blogs.find();
        // info('Blogs retrieved successfully from the database', 'Blog Controller', 'getAllBlog');

        // Cache the result in Redis for future requests
        await redisClient.setEx('blogs', 3600, JSON.stringify(BlogList)); // Cache for 1 hour
        // info('Blogs cached successfully in Redis', 'Blog Controller', 'getAllBlog');

        // Return the fetched data
        res.status(200).json({
            success: true,
            message: 'Blogs retrieved successfully from the database',
            data: BlogList
        });
    } catch (error) {
        ServerError(`Error in fetching blogs: ${error.message}`, 'Blog Controller', 'getAllBlog');
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
        // info('Request received to get a single blog', 'Blog Controller', 'getSingleBlog');

        const { id } = req.params;
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            warn('Redis client is not available, proceeding without cache', 'Blog Controller', 'getSingleBlog');
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
            // info(`Blog with ID ${id} retrieved successfully from cache`, 'Blog Controller', 'getSingleBlog');
            return res.status(200).json({
                success: true,
                status: 'success',
                message: 'Blog retrieved successfully from cache',
                data: JSON.parse(cachedBlog),
            });
        }

        // If not found in cache, fetch from the database
        const Blog = await Blogs.findById(id);

        if (!Blog) {
            warn(`Blog with ID ${id} not found in database`, 'Blog Controller', 'getSingleBlog');
            return res.status(404).json({
                success: false,
                status: 'error',
                message: 'Blog not found',
            });
        }

        // info(`Blog with ID ${id} retrieved successfully from the database`, 'Blog Controller', 'getSingleBlog');

        // Cache the result for future requests
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(Blog)); // Cache for 1 hour
        // info(`Blog with ID ${id} cached successfully in Redis`, 'Blog Controller', 'getSingleBlog');

        // Return the fetched data
        res.status(200).json({
            success: true,
            status: 'success',
            message: 'Blog retrieved successfully from the database',
            data: Blog,
        });
    } catch (error) {
        ServerError(`Error in fetching single blog: ${error.message}`, 'Blog Controller', 'getSingleBlog');
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
        // info('Request received to update blog', 'Blog Controller', 'UpdateBlog');

        const { id } = req.params;
        const file = req.file;

        let thumbnailUrl;

        // If a new file is provided, upload it to Cloudinary
        if (file) {
            // info('New file provided for blog update, starting upload to Cloudinary', 'Blog Controller', 'UpdateBlog');

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

            try {
                // Upload the image and get the URL
                const uploadResult = await uploadFromBuffer(file.buffer);
                thumbnailUrl = uploadResult.url;
                // info('Image uploaded to Cloudinary successfully', 'Blog Controller', 'UpdateBlog');
            } catch (error) {
                ServerError(`Error uploading image to Cloudinary: ${error.message}`, 'Blog Controller', 'UpdateBlog');
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload image to Cloudinary',
                    error: error.message,
                });
            }
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

        // info('Updating blog entry in the database', 'Blog Controller', 'UpdateBlog');

        const updatedBlog = await Blogs.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            warn(`Blog with ID ${id} not found for update`, 'Blog Controller', 'UpdateBlog');
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // info('Blog entry updated in the database successfully', 'Blog Controller', 'UpdateBlog');

        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            warn('Redis client is not available, unable to clear cache', 'Blog Controller', 'UpdateBlog');
            throw new Error('Redis client is not available.');
        }

        // Clear cache for blogs
        await redisClient.del('blogs');
        await redisClient.del(`blogs_${id}`);
        // info('Cache cleared for blogs after update', 'Blog Controller', 'UpdateBlog');

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog,
        });
    } catch (error) {
        ServerError(`Error updating blog: ${error.message}`, 'Blog Controller', 'UpdateBlog');
        res.status(500).json({
            success: false,
            message: 'Failed to update blog',
            error: error.message,
        });
    }
};