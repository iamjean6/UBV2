import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../pgdb/db.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import logger from '../../util/logger.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_DAYS = 7;

// Helper to generate and store a refresh token for users
const generateCustomerRefreshToken = async (userId) => {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
    await pool.query(
        'INSERT INTO auth.refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, refreshToken, expiresAt]
    );
    return refreshToken;
};

// Helper to generate and store a refresh token for admins
const generateAdminRefreshToken = async (adminId) => {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
    await pool.query(
        'INSERT INTO auth.admin_refresh_tokens (admin_id, token, expires_at) VALUES ($1, $2, $3)',
        [adminId, refreshToken, expiresAt]
    );
    return refreshToken;
};

// Google OAuth Route
router.post('/google', async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ status: 'error', message: 'Google token is required' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let result = await pool.query('SELECT * FROM auth.customers WHERE email = $1', [email]);
        let user;

        if (result.rows.length === 0) {
            const randomPassword = crypto.randomBytes(32).toString('hex');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            const insertResult = await pool.query(`
                INSERT INTO auth.customers (name, email, password_hash)
                VALUES ($1, $2, $3)
                RETURNING id, name, email, created_at
            `, [name, email, hashedPassword]);

            user = insertResult.rows[0];
        } else {
            user = result.rows[0];
        }

        const jwtToken = jwt.sign(
            { id: user.id, name: user.name, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = await generateCustomerRefreshToken(user.id);

        res.status(200).json({
            status: 'success',
            message: 'Google login successful',
            token: jwtToken,
            refreshToken,
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
});

// Registration Route
router.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: 'error', message: 'Name, email, and password are required' });
    }

    try {
        const userExists = await pool.query(
            'SELECT * FROM auth.customers WHERE email = $1 OR name = $2',
            [email, name]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Username or email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const queryText = `
            INSERT INTO auth.customers (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at
        `;

        const result = await pool.query(queryText, [name, email, hashedPassword]);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
});

// Login Route
router.post('/login', async (req, res, next) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ status: 'error', message: 'Name and password are required' });
    }

    try {
        const queryText = 'SELECT * FROM auth.customers WHERE name = $1';
        const result = await pool.query(queryText, [name]);

        if (result.rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = await generateCustomerRefreshToken(user.id);

        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            token,
            refreshToken,
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
});

// Admin Login Route
router.post('/admin/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: 'error', message: 'Username and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM auth.admins WHERE username = $1 AND is_active = true', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const role = admin.username === 'jean_obuya16' ? 'superadmin' : 'admin';

        const token = jwt.sign(
            { id: admin.id, name: admin.username, role },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = await generateAdminRefreshToken(admin.id);

        res.status(200).json({
            status: 'success',
            message: 'Admin login successful',
            token,
            refreshToken,
            data: {
                id: admin.id,
                username: admin.username,
                role
            }
        });
    } catch (err) {
        next(err);
    }
});

// Refresh Token Route
router.post('/refresh', async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ status: 'error', message: 'Refresh token is required' });
    }

    try {
        // Check customers first
        const userTokenQuery = await pool.query(
            'SELECT * FROM auth.refresh_tokens WHERE token = $1',
            [refreshToken]
        );

        if (userTokenQuery.rows.length > 0) {
            const tokenRecord = userTokenQuery.rows[0];
            
            if (new Date() > new Date(tokenRecord.expires_at)) {
                await pool.query('DELETE FROM auth.refresh_tokens WHERE token = $1', [refreshToken]);
                return res.status(403).json({ status: 'error', message: 'Refresh token expired' });
            }

            const userCheck = await pool.query('SELECT id, name, email FROM auth.customers WHERE id = $1', [tokenRecord.user_id]);
            if (userCheck.rows.length === 0) {
                return res.status(403).json({ status: 'error', message: 'User not found' });
            }
            
            const user = userCheck.rows[0];
            const newAccessToken = jwt.sign(
                { id: user.id, name: user.name, role: 'customer' },
                process.env.JWT_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRY }
            );

            return res.status(200).json({
                status: 'success',
                message: 'Token refreshed successfully',
                token: newAccessToken
            });
        }

        // Check admins if not found in customers
        const adminTokenQuery = await pool.query(
            'SELECT * FROM auth.admin_refresh_tokens WHERE token = $1',
            [refreshToken]
        );

        if (adminTokenQuery.rows.length > 0) {
            const tokenRecord = adminTokenQuery.rows[0];
            
            if (new Date() > new Date(tokenRecord.expires_at)) {
                await pool.query('DELETE FROM auth.admin_refresh_tokens WHERE token = $1', [refreshToken]);
                return res.status(403).json({ status: 'error', message: 'Refresh token expired' });
            }

            const adminCheck = await pool.query('SELECT id, username FROM auth.admins WHERE id = $1 AND is_active = true', [tokenRecord.admin_id]);
            if (adminCheck.rows.length === 0) {
                return res.status(403).json({ status: 'error', message: 'Admin not found' });
            }

            const admin = adminCheck.rows[0];
            const role = admin.username === 'jean_obuya16' ? 'superadmin' : 'admin';

            const newAccessToken = jwt.sign(
                { id: admin.id, name: admin.username, role },
                process.env.JWT_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRY }
            );

            return res.status(200).json({
                status: 'success',
                message: 'Admin token refreshed successfully',
                token: newAccessToken
            });
        }

        // Token not found in either table
        return res.status(403).json({ status: 'error', message: 'Invalid refresh token' });

    } catch (err) {
        next(err);
    }
});

// Logout Route
router.post('/logout', async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ status: 'error', message: 'Refresh token is required' });
    }

    try {
        await pool.query('DELETE FROM auth.refresh_tokens WHERE token = $1', [refreshToken]);
        await pool.query('DELETE FROM auth.admin_refresh_tokens WHERE token = $1', [refreshToken]);
        
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    } catch (err) {
        next(err);
    }
});

export default router;