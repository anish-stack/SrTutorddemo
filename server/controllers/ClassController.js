const UploadImages = require('../middlewares/Cloudinary');
const Classes = require('../models/ClassModel');
const CatchAsync = require('../utils/CatchAsync');
const { ServerError, warn } = require('../utils/Logger');

exports.CreateClass = CatchAsync(async (req, res) => {
    try {
        const { Class, Subjects, InnerClasses } = req.body;
        const iconsFile = req.file;

        // Check if a class with the same name already exists
        const existingClass = await Classes.findOne({ Class });

        if (existingClass) {
            warn(`Attempt to create a class that already exists: ${Class}`);
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Class with this name already exists.',
            });
        }

        // Initialize variables for the icon URL and public ID
        let iconUrl = '';
        let publicId = '';

        // Upload icon if provided
        if (iconsFile) {
            const uploadResult = await UploadImages(iconsFile);
            iconUrl = uploadResult.url;
            publicId = uploadResult.public_id;
        }

        // Create a new class object
        const newClass = new Classes({
            Class,
            Icons: {
                url: iconUrl || 'No-image',
                Public_id: publicId || 'No_id',
            },
            InnerClasses,
            Subjects: Subjects,
        });

        // Save the new class to the database
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('class');
        await redisClient.del('unique-subjects');
        await newClass.save();

        // Respond with a success message
        res.status(201).json({
            status: 'success',
            data: {
                class: newClass,
            },
        });
    } catch (error) {
        ServerError('Failed to create class', error.message);
        res.status(500).json({
            status: 'fail',
            message: 'Failed to create class',
            error: error.message,
        });
    }
});

exports.EditClassName = CatchAsync(async (req, res) => {
    try {
        const ClassId = req.params.ClassId;

        // Find Class by ID
        const ExistClass = await Classes.findById(ClassId);
        if (!ExistClass) {
            warn(`Attempt to edit non-existent class ID: ${ClassId}`);
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Class with this ID does not exist.',
            });
        }

        const { UpdatedClassName } = req.body;

        // Check if the updated class name is provided
        if (!UpdatedClassName) {
            warn('No class name provided for updating.');
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Please provide a class name for updating.',
            });
        }

        // Update the class name
        ExistClass.Class = UpdatedClassName;
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('class');
        await redisClient.del('unique-subjects');
        await ExistClass.save();

        // Respond with success message
        return res.status(200).json({
            success: true,
            status: 'success',
            message: 'Class name updated successfully.',
            data: {
                class: ExistClass
            },
        });
    } catch (error) {
        ServerError('Error updating class name', error.message);
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while updating the class name.',
            error: error.message,
        });
    }
});

exports.EditSubjectName = CatchAsync(async (req, res) => {
    try {
        const ClassId = req.params.ClassId;
        const { SubjectId, UpdatedSubjectName } = req.body;

        // Find the class by ID
        const ExistClass = await Classes.findById(ClassId);
        if (!ExistClass) {
            warn(`Attempt to edit a subject in a non-existent class ID: ${ClassId}`);
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Class with this ID does not exist.',
            });
        }

        // Find the subject in the Subjects array
        const subject = ExistClass.Subjects.id(SubjectId);
        if (!subject) {
            warn(`Subject with ID ${SubjectId} does not exist in class ID: ${ClassId}`);
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Subject with this ID does not exist.',
            });
        }

        // Update the subject name
        subject.SubjectName = UpdatedSubjectName;
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('class');
        await redisClient.del('unique-subjects');
        await ExistClass.save();

        // Respond with success message
        res.status(200).json({
            success: true,
            status: 'success',
            message: 'Subject name updated successfully.',
            data: {
                class: ExistClass
            },
        });
    } catch (error) {
        ServerError('Error updating subject name', error.message);
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while updating the subject name.',
            error: error.message,
        });
    }
});

exports.deleteAnySubject = CatchAsync(async (req, res) => {
    try {
        const { ClassId, SubjectId } = req.params;

        // Find the class by ID
        const ExistClass = await Classes.findById(ClassId);
        if (!ExistClass) {
            warn(`Attempt to delete a subject from a non-existent class ID: ${ClassId}`);
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Class with this ID does not exist.',
            });
        }

        // Remove the subject from the class's subjects
        const subject = ExistClass.Subjects.id(SubjectId);
        if (!subject) {
            warn(`Subject with ID ${SubjectId} does not exist in class ID: ${ClassId}`);
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Subject with this ID does not exist in the class.',
            });
        }

        // Remove the subject
        subject.deleteOne();
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('class');
        await ExistClass.save();

        // Respond with success message
        return res.status(200).json({
            success: true,
            status: 'success',
            message: 'Subject deleted successfully.',
        });
    } catch (error) {
        ServerError('Error deleting subject', error.message);
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while deleting the subject.',
            error: error.message,
        });
    }
});

exports.deleteClass = CatchAsync(async (req, res) => {
    try {
        const { ClassId } = req.params;

        // Find and delete the class
        const deletedClass = await Classes.findByIdAndDelete(ClassId);
        if (!deletedClass) {
            warn(`Attempt to delete a non-existent class ID: ${ClassId}`);
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Class with this ID does not exist.',
            });
        }
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        await redisClient.del('class');
        await redisClient.del('unique-subjects');

        // Respond with success message
        return res.status(200).json({
            success: true,
            status: 'success',
            message: 'Class deleted successfully.',
        });
    } catch (error) {
        ServerError('Error deleting class', error.message);
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while deleting the class.',
            error: error.message,
        });
    }
});

exports.GetAllClass = CatchAsync(async (req, res) => {
    try {
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        const cachedClasses = await redisClient.get('class');
        if (cachedClasses) {
            const activeClasses = JSON.parse(cachedClasses);
            return res.status(200).json({
                success: true,
                message: "Data fetched from cache",
                data: activeClasses
            });
        } else {
            const classes = await Classes.find();
            if (!classes.length) {
                warn('No classes found in the database.');
                return res.status(404).json({
                    success: false,
                    status: 'fail',
                    message: 'No classes found.',
                });
            }

            // Cache the fetched classes
            await redisClient.set('class', JSON.stringify(classes));

            return res.status(200).json({
                success: true,
                message: "Data fetched from database",
                data: classes
            });
        }
    } catch (error) {
        ServerError('Error fetching classes', error.message);
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while fetching the classes.',
            error: error.message,
        });
    }
});


exports.GetSubjectsWithClassIds = CatchAsync(async (req, res) => {
    try {
        const { ClassId } = req.params;
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            return res.status(500).json({
                success: false,
                status: 'error',
                message: 'Redis client is not available.',
            });
        }

        // Validate ClassId
        if (!ClassId) {
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'ClassId is required.',
            });
        }

        // Check cache first
        const cacheKey = `subjects_${ClassId}`;
        const cachedSubjects = await redisClient.get(cacheKey);

        if (cachedSubjects) {
            return res.status(200).json({
                success: true,
                status: 'success',
                message: "Data retrieved from cache",
                data: JSON.parse(cachedSubjects),
            });
        } else {
            // First attempt: Find class by ID
            let classes = await Classes.findById(ClassId);

            // If not found, search all classes for a matching InnerClass
            if (!classes) {
                classes = await Classes.findOne({
                    'InnerClasses._id': ClassId
                });

                if (classes) {
                    const innerClass = classes.InnerClasses.find(inner => inner._id.toString() === ClassId);

                    if (!innerClass) {
                        warn('No InnerClass found with the provided ID.');
                        return res.status(404).json({
                            success: false,
                            status: 'fail',
                            message: 'No InnerClass found with the provided ID.',
                        });
                    }

                    const Subjects = {
                        Class: classes.Class,
                        Subjects: classes.Subjects,
                    };

                    // Cache the result
                    await redisClient.setEx(cacheKey, 3600, JSON.stringify(Subjects));

                    return res.status(200).json({
                        success: true,
                        message: "Data retrieved from database",
                        status: 'success',
                        data: Subjects,
                    });
                }

                warn('No classes or InnerClasses found with the provided ID.');
                return res.status(404).json({
                    success: false,
                    status: 'fail',
                    message: 'No classes or InnerClasses found with the provided ID.',
                });
            }

            if (classes.Subjects.length === 0) {
                warn('No subjects found for this class.');
                return res.status(404).json({
                    success: false,
                    status: 'fail',
                    message: 'No subjects found for this class.',
                });
            }

            const Subjects = {
                Class: classes.Class,
                Subjects: classes.Subjects,
            };

            // Cache the result
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(Subjects));

            return res.status(200).json({
                success: true,
                message: "Data retrieved from database",
                status: 'success',
                data: Subjects,
            });
        }
    } catch (error) {
        ServerError('Error fetching subjects', error.message);
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while retrieving subjects.',
            error: error.message,
        });
    }
});


exports.AddSubjectInClass = CatchAsync(async (req, res) => {
    try {
        const { ClassId } = req.params;
        const { Subjects } = req.body;

        const checkClass = await Classes.findById(ClassId);
        if (!checkClass) {
            warn('No class found with the provided ID.');
            return res.status(404).json({
                success: false,
                status: 'fail',
                message: 'No class found with the provided ID.',
            });
        }

        if (!Subjects || !Array.isArray(Subjects) || Subjects.length === 0) {
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Please provide at least one subject.',
            });
        }

        checkClass.Subjects.push(...Subjects);

        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        await redisClient.del('class');
        await redisClient.del('unique-subjects');

        await checkClass.save();

        res.status(200).json({
            success: true,
            status: 'success',
            message: 'Subjects added successfully.',
            data: {
                class: checkClass
            },
        });
    } catch (error) {
        ServerError('Error adding subjects', error.message);
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while adding subjects.',
            error: error.message,
        });
    }
});


exports.GetUniqueAllSubjects = CatchAsync(async (req, res) => {
    try {
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        const cacheKey = 'unique-subjects';

        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            return res.status(200).json({
                success: true,
                message: 'Data retrieved from cache',
                status: 'success',
                data: JSON.parse(cachedData)
            });
        }

        const classes = await Classes.find();
        if (!classes || classes.length === 0) {
            warn('No classes found.');
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

        await redisClient.setEx(cacheKey, 2 * 60 * 60, JSON.stringify(uniqueSubjects));

        return res.status(200).json({
            success: true,
            message: 'Data retrieved from database',
            status: 'success',
            data: uniqueSubjects
        });
    } catch (error) {
        ServerError('Error retrieving unique subjects', error.message);
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while retrieving unique subjects.',
            error: error.message,
        });
    }
});
