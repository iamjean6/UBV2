import jwt from 'jsonwebtoken';
import pool from '../pgdb/db.js';
import logger from '../util/logger.js';

// Middleware to protect routes that require customer authentication
export const protectCustomerRoute = async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if user still exists in database
            const userCheck = await pool.query('SELECT id, name FROM auth.customers WHERE id = $1', [decoded.id]);

            if (userCheck.rows.length === 0) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Not authorized, user no longer exists'
                });
            }

            // Attach user data from db to request object (safer than relying on stale JWT payload)
            req.user = userCheck.rows[0]; // Contains { id, name }

            next();
        } catch (error) {
            logger.error('Not authorized, token failed:', error.message);
            res.status(401).json({
                status: 'error',
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        res.status(401).json({
            status: 'error',
            message: 'Not authorized, no token'
        });
    }
};

// Middleware to protect routes that require Admin or Superadmin authentication
export const protectAdminRoute = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
                return res.status(403).json({ status: 'error', message: 'Access denied, admin role required' });
            }

            const adminCheck = await pool.query('SELECT id, username FROM auth.admins WHERE id = $1 AND is_active = true', [decoded.id]);

            if (adminCheck.rows.length === 0) {
                return res.status(401).json({ status: 'error', message: 'Not authorized, admin no longer exists' });
            }

            req.user = { id: adminCheck.rows[0].id, name: adminCheck.rows[0].username, role: decoded.role };
            next();
        } catch (error) {
            logger.error('Admin Auth Error:', error.message);
            res.status(401).json({ status: 'error', message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ status: 'error', message: 'Not authorized, no token' });
    }
};

// Middleware to protect routes that require Superadmin authentication
export const protectSuperAdminRoute = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.role !== 'superadmin') {
                return res.status(403).json({ status: 'error', message: 'Access denied, superadmin role required' });
            }

            const adminCheck = await pool.query('SELECT id, username FROM auth.admins WHERE id = $1 AND is_active = true', [decoded.id]);

            if (adminCheck.rows.length === 0) {
                return res.status(401).json({ status: 'error', message: 'Not authorized, admin no longer exists' });
            }

            req.user = { id: adminCheck.rows[0].id, name: adminCheck.rows[0].username, role: decoded.role };
            next();
        } catch (error) {
            logger.error('Superadmin Auth Error:', error.message);
            res.status(401).json({ status: 'error', message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ status: 'error', message: 'Not authorized, no token' });
    }
};
