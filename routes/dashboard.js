const express = require('express');
const router = express.Router();
const db = require('../db');
const isLoggedIn = require('../middleware/isLoggedIn');

// GET /dashboard
router.get('/', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'employer') return res.redirect('/jobs');
  try {
    const [jobs] = await db.query(
      `SELECT jobs.*, COUNT(applications.id) as applicant_count
       FROM jobs
       LEFT JOIN applications ON jobs.id = applications.job_id
       WHERE jobs.user_id = ?
       GROUP BY jobs.id
       ORDER BY jobs.created_at DESC`,
      [req.session.user.id]
    );
    res.render('dashboard/index', { jobs, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
});

// GET /dashboard/applicants/:jobId - see who applied
router.get('/applicants/:jobId', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'employer') return res.redirect('/jobs');
  try {
    const [job] = await db.query(
      'SELECT * FROM jobs WHERE id = ? AND user_id = ?',
      [req.params.jobId, req.session.user.id]
    );
    if (job.length === 0) return res.send('Not found or unauthorized');

    const [applicants] = await db.query(
      `SELECT applications.*, users.name, users.email
       FROM applications
       JOIN users ON applications.user_id = users.id
       WHERE applications.job_id = ?
       ORDER BY applications.applied_at DESC`,
      [req.params.jobId]
    );
    res.render('dashboard/applicants', { job: job[0], applicants, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.send('Error loading applicants');
  }
});

// POST /dashboard/applicants/:appId/status - update application status
router.post('/applicants/:appId/status', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'employer') return res.redirect('/jobs');
  const { status, jobId } = req.body;
  try {
    await db.query(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, req.params.appId]
    );
    res.redirect(`/dashboard/applicants/${jobId}`);
  } catch (err) {
    console.error(err);
    res.send('Error updating status');
  }
});

module.exports = router;