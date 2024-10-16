const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAdmin = async (req, res, next) => {
    try {
        // Retrieve the token from the cookies, request body, or headers
        const token = req.cookies.token || req.body.token || req.headers.authorization?.split(' ')[1];
        // console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded token payload to the request object
        req.user = decoded;

        // Check if the user has an admin role
        if (decoded.id.Role === 'admin') {
            // User is an admin; proceed to the next middleware or route handler
            return next();
        } else {
            // User is not an admin
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

    } catch (error) {
        // Handle token-related errors
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            // Respond with an appropriate error message
            return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
        } else {
            // Handle other errors
            console.error('Error in isAdmin middleware:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = isAdmin;
