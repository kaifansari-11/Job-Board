const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// GET /auth/register
router.get('/register', (req, res) => {
    res.render('auth/register', { error: null });
});

// POST /auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { error: 'Email already exists or something went wrong.' });
    }
});

// GET /auth/login
router.get('/login', (req, res) => {
    res.render('auth/login', { error: null });
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.render('auth/login', { error: 'Invalid email or password.' });
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.render('auth/login', { error: 'Invalid email or password.' });
        }
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        if (user.role === 'employer') {
            res.redirect('/dashboard');
        } else {
            res.redirect('/jobs');
        }
    } catch (err) {
        console.error(err);
        res.render('auth/login', { error: 'Something went wrong.' });
    }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;