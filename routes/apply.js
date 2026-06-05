const express = require('express');
const router = express.Router();
const db = require('../db');
const isLoggedIn = require('../middleware/isLoggedIn');

// POST /apply/:jobId - submit application
router.post('/:jobId', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'seeker') return res.redirect('/jobs');
  const { cover_letter } = req.body;
  try {
    await db.query(
      'INSERT INTO applications (job_id, user_id, cover_letter) VALUES (?, ?, ?)',
      [req.params.jobId, req.session.user.id, cover_letter]
    );
    res.redirect('/apply/my-applications');
  } catch (err) {
    console.error(err);
    res.send('Error submitting application');
  }
});

// GET /apply/my-applications - seeker sees their applications
router.get('/my-applications', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'seeker') return res.redirect('/dashboard');
  try {
    const [applications] = await db.query(
      `SELECT applications.*, jobs.title, jobs.company, jobs.location
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       WHERE applications.user_id = ?
       ORDER BY applications.applied_at DESC`,
      [req.session.user.id]
    );
    res.render('apply/my-applications', { applications, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.send('Error loading applications');
  }
});

module.exports = router;