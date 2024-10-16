const { body, validationResult } = require('express-validator');

const validateTeacherRequest = [
    body('ClassName')
        .trim()
        .escape()
        .notEmpty().withMessage('ClassName is required'),

    body('Subjects.*.SubjectName')
        .trim()
        .escape()
        .notEmpty().withMessage('SubjectName is required'),

 
    body('InterestedInTypeOfClass')
        .trim()
        .escape()
        .isIn(["Online Class","Institute or Group Tuition", "Home Tuition at My Home", "Willing to travel to Teacher's Home"])
        .withMessage('Invalid type of class'),

    body('StudentInfo.StudentName')
        .trim()
        .escape()
        .notEmpty().withMessage('StudentName is required'),

    body('StudentInfo.ContactNumber')
        .trim()
        .escape()
        .notEmpty().withMessage('ContactNumber is required'),

    body('StudentInfo.EmailAddress')
        .isEmail().withMessage('Invalid EmailAddress'),

    body('TeacherGenderPreference')
        .trim()
        .escape()
        .isIn(["Male", "Female", "Any"])
        .withMessage('Invalid TeacherGenderPreference'),

    body('NumberOfSessions')
        .isInt({ min: 1 }).withMessage('NumberOfSessions must be at least 1'),

    body('minBudget')
        .isFloat({ min: 0 }).withMessage('minBudget must be a positive number'),

    body('maxBudget')
        .isFloat({ min: 0 }).withMessage('maxBudget must be a positive number'),

    body('Locality')
        .trim()
        .escape()
        .notEmpty().withMessage('Locality is required'),

    body('StartDate')
        .trim()
        .escape()
        .isIn(["Immediately", "Within next 2 weeks", "Not sure, right now just checking prices"])
        .withMessage('Invalid StartDate'),

    body('SpecificRequirement')
        .optional()
        .trim()
        .escape(),

    body('Otp')
        .optional()
        .trim()
        .escape(),

    body('StudentId')
        .optional()
        .isMongoId().withMessage('Invalid Student ID'),

    body('longitude')
        .optional()
        .isFloat().withMessage('Invalid longitude'),

    body('latitude')
        .optional()
        .isFloat().withMessage('Invalid latitude'),
];

const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateTeacherRequest,
    validateResult,
};
