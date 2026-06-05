const express = require('express');
const router = express.Router();
const db = require('../db');
const isLoggedIn = require('../middleware/isLoggedIn');
const { uploadAvatar, uploadResume } = require('../config/cloudinary');

// GET /profile — view own profile
router.get('/', isLoggedIn, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
  res.render('profile/index', { profile: rows[0], user: req.session.user });
});

// GET /profile/edit — edit form
router.get('/edit', isLoggedIn, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
  res.render('profile/edit', { profile: rows[0], user: req.session.user, error: null, success: null });
});

// POST /profile/update — save text fields
router.post('/update', isLoggedIn, async (req, res) => {
  const {
    bio, location, linkedin, github, portfolio,
    skills, experience, education,
    company_name, industry, company_size, company_website, company_about
  } = req.body;
  try {
    await db.query(
      `UPDATE users SET bio=?, location=?, linkedin=?, github=?, portfolio=?,
       skills=?, experience=?, education=?,
       company_name=?, industry=?, company_size=?, company_website=?, company_about=?
       WHERE id=?`,
      [bio, location, linkedin, github, portfolio,
       skills, experience, education,
       company_name, industry, company_size, company_website, company_about,
       req.session.user.id]
    );
    res.redirect('/profile?success=1');
  } catch (err) {
    console.error(err);
    res.redirect('/profile/edit');
  }
});

// POST /profile/upload-avatar
router.post('/upload-avatar', isLoggedIn, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    await db.query('UPDATE users SET avatar_url=? WHERE id=?', [req.file.path, req.session.user.id]);
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.redirect('/profile');
  }
});

// POST /profile/upload-resume (seeker only)
router.post('/upload-resume', isLoggedIn, uploadResume.single('resume'), async (req, res) => {
  try {
    await db.query('UPDATE users SET resume_url=? WHERE id=?', [req.file.path, req.session.user.id]);
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.redirect('/profile');
  }
});

// GET /profile/:id — view anyone's profile
router.get('/:id', isLoggedIn, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.send('User not found');
  res.render('profile/view', { profile: rows[0], user: req.session.user });
});

router.get('/', isLoggedIn, async (req, res) => {
  if (req.session.user.role === 'admin') return res.redirect('/admin');
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
  res.render('profile/index', { profile: rows[0], user: req.session.user });
});

module.exports = router;