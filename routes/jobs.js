const express = require('express');
const router = express.Router();
const db = require('../db');
const isLoggedIn = require('../middleware/isLoggedIn');

// GET /jobs
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const [jobs] = await db.query(
      'SELECT jobs.*, users.name as employer_name FROM jobs JOIN users ON jobs.user_id = users.id ORDER BY jobs.created_at DESC'
    );
    res.render('jobs/index', { jobs, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.send('Error loading jobs');
  }
});

module.exports = router;