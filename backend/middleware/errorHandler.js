import logger from '../util/logger.js';

const errorHandler = (err, req, res, next) => {
    logger.error('Error handled by global middleware:', err);

    // 1. PostgreSQL Unique Constraint Violation (Error Code 23505)
    if (err.code === '23505') {
        let message = 'A record with this information already exists.';
        
        // Try to extract the field name from the detail string
        // Example detail: "Key (name)=(Urbanville) already exists."
        const match = err.detail && err.detail.match(/\((.*?)\)=\((.*?)\)/);
        if (match) {
            const fields = match[1].split(', ');
            const values = match[2].split(', ');

            if (fields.includes('jersey_number')) {
                message = `The jersey number "${values[fields.indexOf('jersey_number')]}" is already taken within this team.`;
            } else if (fields.includes('name')) {
                message = `The name "${values[fields.indexOf('name')]}" is already in use. Please try another.`;
            } else if (fields.includes('email')) {
                message = `This email address is already registered.`;
            } else if (fields.includes('slug')) {
                message = `This product identifier (slug) is already taken.`;
            } else {
                const friendlyFields = fields.map(f => f.replace('_', ' ')).join(' and ');
                message = `The ${friendlyFields} combination already exists.`;
            }
        }

        return res.status(400).json({
            status: 'error',
            message: message
        });
    }

    // 2. Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            status: 'error',
            message: `Validation Error: ${messages.join(', ')}`
        });
    }

    // 3. Mongoose Duplicate Key Error (MongoDB Code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            status: 'error',
            message: `A record with this ${field} already exists.`
        });
    }

    // 4. Default Internal Server Error
    const statusCode = err.status || 500;
    const responseMessage = err.message || 'An internal server error occurred';

    res.status(statusCode).json({
        status: 'error',
        message: responseMessage
    });
};

export default errorHandler;
