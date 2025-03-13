const bannerModel = require('../models/Banners.model')
const HeroBanner = require('../models/Hero.Banner.model')
const Blogs = require('../models/Blog.model');
const ParticularTeacher = require('../models/Particular.model')
const Student = require('../models/Student.model')
const cityModel = require("../models/City.model"); // Assuming the model is named 'City.model'
const Classes = require('../models/ClassModel');
const AllTeacher = require("../models/Teacher.model");
const Testimonial = require('../models/Testinomial.mode')
const Newsletter = require('../models/NewsLetterModal');
const streamifier = require('streamifier');
const CatchAsync = require('../utils/CatchAsync');
const Cloudinary = require('cloudinary').v2;
const Contact = require('../models/ContactUsModel');
const Request = require('../models/UniversalSchema');
const axios = require('axios')
const TeacherProfile = require('../models/TeacherProfile.model');
require('dotenv').config();

// Configure Cloudinary
Cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});


exports.createBanner = async (req, res) => {
    try {
        const { ButtonText, active, RedirectPageUrl, Para, Position } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }
        const checkPosition = await bannerModel.find({ Position })

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
                Para,
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


exports.AnalyticalData = CatchAsync(async (req, res) => {
    const redisClient = req.app.locals.redis;
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - 7);

    try {
        // Helper function to get data from Redis or fetch from database
        const getDataFromCacheOrDb = async (key, dbQuery) => {
            const cachedData = await redisClient.get(key);
            if (cachedData) {
                return JSON.parse(cachedData);
            } else {
                const data = await dbQuery();
                await redisClient.set(key, JSON.stringify(data), 'EX', 3600); // Cache for 1 hour
                return data;
            }
        };

        // Fetch counts from Redis or database
        const [bannerCount, heroBannerCount, blogCount, cityCount, classCount] = await Promise.all([
            getDataFromCacheOrDb('bannerCount', () => bannerModel.countDocuments()),
            getDataFromCacheOrDb('heroBannerCount', () => HeroBanner.countDocuments()),
            getDataFromCacheOrDb('blogCount', () => Blogs.countDocuments({ createdAt: { $gte: now.setDate(1) } })),
            getDataFromCacheOrDb('cityCount', () => cityModel.countDocuments()),
            getDataFromCacheOrDb('classCount', () => Classes.countDocuments())
        ]);

        // Calculate counts for particularTeacher, student, subjectTeacherRequest, and testimonial
        const ToadyRequest = await Request.countDocuments({ createdAt: { $gte: todayStart } })

        const AllRequest = await Request.countDocuments()

        const [studentCountToday, totalCountStudent, studentCountWeekAgo] = await Promise.all([
            Student.countDocuments({ createdAt: { $gte: todayStart } }),
            getDataFromCacheOrDb('totalCountStudent', () => Student.countDocuments()),
            Student.countDocuments({ createdAt: { $gte: weekStart, $lt: todayStart } })
        ]);

        const TeacherHaveDoneProfile = await TeacherProfile.countDocuments()
        const TeacherHaveDoneNotDoneProfile = await AllTeacher.countDocuments()




        const [testimonialCountToday, totalCountTestimonial, testimonialCountWeekAgo] = await Promise.all([
            Testimonial.countDocuments({ createdAt: { $gte: todayStart } }),
            getDataFromCacheOrDb('totalCountTestimonial', () => Testimonial.countDocuments()),
            Testimonial.countDocuments({ createdAt: { $gte: weekStart, $lt: todayStart } })
        ]);

        // Calculate subscriber counts
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month

        const previousMonthCount = await Newsletter.countDocuments({
            subscribedAt: {
                $gte: previousMonthStart,
                $lte: previousMonthEnd
            }
        });

        const currentMonthCount = await Newsletter.countDocuments({
            subscribedAt: {
                $gte: currentMonthStart
            }
        });

        const monthDifference = currentMonthCount - previousMonthCount;
        const percentageDifference = previousMonthCount
            ? ((monthDifference / previousMonthCount) * 100).toFixed(2)
            : '0';

        // Fetch unique subjects
        const classes = await Classes.find();
        if (!classes || classes.length === 0) {
            return res.status(404).json({
                success: false,
                status: 'fail',
                message: 'No classes found.',
            });
        }

        const subjectsSet = new Set();
        classes.forEach(classDoc => {
            classDoc.Subjects.forEach(subject => {
                subjectsSet.add(subject.SubjectName);
            });
        });

        const uniqueSubjects = Array.from(subjectsSet).map(subjectName => ({ SubjectName: subjectName }));

        // Collecting data
        const data = {
            bannerCount,
            heroBannerCount,
            blogCount: {
                currentMonthCount: await Blogs.countDocuments({ createdAt: { $gte: currentMonthStart } }),
                previousMonthCount: await Blogs.countDocuments({ createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd } })
            },
            TeacherHaveDoneProfile,
            TeacherHaveDoneNotDoneProfile,
            student: {
                today: studentCountToday,
                total: totalCountStudent,
                weekAgo: studentCountWeekAgo
            },
            TodayTeacherRequest: ToadyRequest,
            AllTimeRequest: AllRequest,
            testimonial: {
                today: testimonialCountToday,
                weekAgo: testimonialCountWeekAgo,
                total: totalCountTestimonial
            },
            cityCount,
            classCount,
            Subjects: uniqueSubjects.length,
            subscribers: {
                subscriberCount: await Newsletter.countDocuments(),
                currentMonthCount,
                previousMonthCount,
                monthDifference,
                percentageDifference
            }
        };

        // Sending response
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        // Error handling
        console.error("Error fetching analytical data:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching analytical data.",
            error: error.message,
        });
    }
});

exports.CreateContact = CatchAsync(async (req, res) => {
    try {
        const { Name, Email, Phone, Subject, Message, StudentId, TeacherId, recaptchaToken } = req.body;

        const queryType = StudentId ? "Registered Student" : TeacherId ? "Registered Teacher" : "General Inquiry";

        const secretKey = "6LfZG_MqAAAAAH_UENSs7CrCLQX0i748qOBmhkyQ";
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
        );

        if (!response.data.success) {
            return res.status(400).json({ error: "reCAPTCHA verification failed" });
        }

        const newContact = await Contact.create({
            Name,
            Email,
            Phone,
            Subject,
            Message,
            StudentId,
            TeacherId,
            QueryType: queryType
        });

        // Return the created contact
        return res.status(201).json({
            success: true,
            data: newContact
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Unable to create contact.'
        });
    }
});


// Get all contacts sorted by timestamps
exports.GetAllContact = CatchAsync(async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 }).populate(['StudentId', 'TeacherId']); // Retrieve all contacts sorted by createdAt in descending order

        return res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Unable to retrieve contacts.'
        });
    }
});


// Delete a contact by ID
exports.DeleteContact = CatchAsync(async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the contact
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Contact deleted successfully.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Unable to delete contact.'
        });
    }
});