const UploadImages = require('../middlewares/Cloudinary');
const Classes = require('../models/ClassModel');
const CatchAsync = require('../utils/CatchAsync');

exports.CreateClass = CatchAsync(async (req, res) => {
    try {
        const { Class, Subjects,InnerClasses } = req.body;
        const iconsFile = req.file;

        // Check if a class with the same name already exists
        const existingClass = await Classes.findOne({ Class });

        if (existingClass) {
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

        // Prepare subjects array
        // const subjectsArray = Subjects.map(subject => subject.SubjectName);

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
        // Handle any errors
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
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Class with this ID does not exist.',
            });
        }

        const { UpdatedClassName } = req.body;

        // Check if the updated class name is provided
        if (!UpdatedClassName) {
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
        // Handle any errors
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
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Class with this ID does not exist.',
            });
        }

        // Find the subject in the Subjects array
        const subject = ExistClass.Subjects.id(SubjectId);
        if (!subject) {
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
        // Save the class with the updated subject
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
        // Handle any errors
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
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Class with this ID does not exist.',
            });
        }

        // Remove the subject from the class's subjects
        const subject = ExistClass.Subjects.id(SubjectId);
        if (!subject) {
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
        // Retrieve all classes

        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }
        const cachedClass = await redisClient.get('class');
        if (cachedClass) {
            const activeClass = JSON.parse(cachedClass);

            return res.status(200).json({
                success: true,
                message: "data from cached",
                data: activeClass
            });
        }
        else {
            const classes = await Classes.find();
            if (!classes.length) {
                return res.status(404).json({
                    success: false,
                    status: 'fail',
                    message: 'No classes found.',
                });
            }
            await redisClient.set('class', JSON.stringify(classes));

            return res.status(200).json({
                success: true,
                status: 'success',
                message: "data from db",
                data:
                    classes
                ,
            });
        }
        // Respond with the list of classes

    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while retrieving classes.',
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

        // Validate ClassId if needed
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
                    // Find the specific InnerClass with the matching ID
                    const innerClass = classes.InnerClasses.find(inner => inner._id.toString() === ClassId);

                    if (!innerClass) {
                        return res.status(404).json({
                            success: false,
                            status: 'fail',
                            message: 'No InnerClass found with the provided ID.',
                        });
                    }

                    // Return data for the found InnerClass
                    const Subjects = {
                        Class: classes.Class,
                        Subjects: classes.Subjects,
                    };

                    // Cache the result for future requests
                    await redisClient.setEx(cacheKey, 3600, JSON.stringify(Subjects));

                    // Respond with the list of subjects
                    return res.status(200).json({
                        success: true,
                        message: "Data retrieved from database",
                        status: 'success',
                        data: Subjects,
                    });
                }

                return res.status(404).json({
                    success: false,
                    status: 'fail',
                    message: 'No classes or InnerClasses found with the provided ID.',
                });
            }

            if (classes.Subjects.length === 0) {
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

            // Cache the result for future requests
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(Subjects));

            // Respond with the list of subjects
            return res.status(200).json({
                success: true,
                message: "Data retrieved from database",
                status: 'success',
                data: Subjects,
            });
        }
    } catch (error) {
        console.error('Error fetching subjects:', error.message);
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

        // Find the class by ID
        const checkClass = await Classes.findById(ClassId);
        if (!checkClass) {
            return res.status(404).json({
                success: false,
                status: 'fail',
                message: 'No class found with the provided ID.',
            });
        }

        // Validate Subjects
        if (!Subjects || !Array.isArray(Subjects) || Subjects.length === 0) {
            return res.status(400).json({
                success: false,
                status: 'fail',
                message: 'Please provide at least one subject.',
            });
        }

        // Add subjects to the class
        checkClass.Subjects.push(...Subjects);
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('class');
        await redisClient.del('unique-subjects');

        // Save the updated class document
        await checkClass.save();

        // Respond with success message
        res.status(200).json({
            success: true,
            status: 'success',
            message: 'Subjects added successfully.',
            data: {
                class: checkClass
            },
        });
    } catch (error) {
        // Handle any errors
        res.status(500).json({
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

        // Try fetching the data from Redis cache
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            // If cached data exists, return it
            return res.status(200).json({
                success: true,
                message: 'data from cached',
                status: 'success',
                data: JSON.parse(cachedData)
            });
        }

        // Fetch all classes from the database
        const classes = await Classes.find();
        if (!classes || classes.length === 0) {
            return res.status(404).json({
                success: false,
                status: 'fail',
                message: 'No classes found.',
            });
        }

        // Initialize a set to store unique subjects
        const subjectsSet = new Set();

        // Iterate over all classes and collect subjects
        classes.forEach(classDoc => {
            classDoc.Subjects.forEach(subject => {
                subjectsSet.add(subject.SubjectName);
            });
        });

        // Convert the set to an array
        const uniqueSubjects = Array.from(subjectsSet).map(subjectName => ({ SubjectName: subjectName }));

        // Store the unique subjects in Redis cache with a 2-hour expiration
        await redisClient.setEx(cacheKey, 2 * 60 * 60, JSON.stringify(uniqueSubjects));

        // Respond with the list of unique subjects
        return res.status(200).json({
            success: true,
            message: 'data from db',
            status: 'success',
            data: uniqueSubjects
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'An error occurred while retrieving subjects.',
            error: error.message,
        });
    }
});
