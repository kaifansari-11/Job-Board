const express = require('express');
const router = express.Router();
const db = require('../db');
const isLoggedIn = require('../middleware/isLoggedIn');

// GET /dashboard
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const [jobs] = await db.query(
      'SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC',
      [req.session.user.id]
    );
    res.render('dashboard/index', { jobs, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
});

module.exports = router;