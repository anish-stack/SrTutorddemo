const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


const handleMulterErrors = (req, res, next) => {
    if (!req.headers || !req.headers['content-type']) {
        return res.status(400).json({
            success: false,
            message: 'Missing content-type header or empty request body'
        });
    }
    next();
};

const UploadViaFieldName = (fields) => {
    return upload.fields(fields);
};

// Middleware for single image upload
const singleUploadImage = upload.single('image');

// Middleware for multiple images upload
const multipleImages = upload.array('images', 10); // 10 is the max count of images you want to allow



module.exports = {
    singleUploadImage,
    multipleImages,
    UploadViaFieldName
};
