import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../pgdb/db.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import logger from '../../util/logger.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

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

        // 1. Check if user already exists
        let result = await pool.query('SELECT * FROM auth.customers WHERE email = $1', [email]);
        let user;

        if (result.rows.length === 0) {
            // 2. Register new OAuth user with a random unguessable password
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
            // 3. User exists, just log them in
            user = result.rows[0];
        }

        // 4. Issue the standard JWT token
        const jwtToken = jwt.sign(
            { id: user.id, name: user.name, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Google login successful',
            token: jwtToken,
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
        return res.status(400).json({
            status: 'error',
            message: 'Name, email, and password are required'
        });
    }

    try {
        // Check if user already exists
        const userExists = await pool.query(
            'SELECT * FROM auth.customers WHERE email = $1 OR name = $2',
            [email, name]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Username or email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new customer
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


router.post('/login', async (req, res, next) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Name and password are required'
        });
    }

    try {
        // Find user by username
        const queryText = 'SELECT * FROM auth.customers WHERE name = $1';
        const result = await pool.query(queryText, [name]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid username or password'
            });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid username or password'
            });
        }


        const token = jwt.sign(
            { id: user.id, name: user.name, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            token,
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

        // Determine role based on username
        const role = admin.username === 'jean_obuya16' ? 'superadmin' : 'admin';

        const token = jwt.sign(
            { id: admin.id, name: admin.username, role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Admin login successful',
            token,
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

export default router;