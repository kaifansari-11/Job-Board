const express = require('express');
const router = express.Router();
const db = require('../db');
const isLoggedIn = require('../middleware/isLoggedIn');

// GET /profile - own profile
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    res.render('profile/index', { profile: rows[0], user: req.session.user, success: null });
  } catch (err) {
    console.error(err);
    res.send('Error loading profile');
  }
});

// GET /profile/:id - view anyone's profile
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.send('User not found');
    res.render('profile/view', { profile: rows[0], user: req.session.user });
  } catch (err) {
    console.error(err);
    res.send('Error loading profile');
  }
});

// POST /profile/update - update own profile
router.post('/update', isLoggedIn, async (req, res) => {
  const {
    bio, location, linkedin, github, portfolio,
    skills, experience, education,
    company_name, industry, company_size, company_website, company_about
  } = req.body;
  try {
    await db.query(
      `UPDATE users SET
        bio=?, location=?, linkedin=?, github=?, portfolio=?,
        skills=?, experience=?, education=?,
        company_name=?, industry=?, company_size=?, company_website=?, company_about=?
       WHERE id=?`,
      [
        bio, location, linkedin, github, portfolio,
        skills, experience, education,
        company_name, industry, company_size, company_website, company_about,
        req.session.user.id
      ]
    );
    // update session name if changed
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    res.render('profile/index', { profile: rows[0], user: req.session.user, success: 'Profile updated successfully!' });
  } catch (err) {
    console.error(err);
    res.send('Error updating profile');
  }
});

module.exports = router;