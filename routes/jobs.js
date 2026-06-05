const express = require('express');
const router = express.Router();
const db = require('../db');
const isLoggedIn = require('../middleware/isLoggedIn');

async function getNotifications(userId) {
  const [rows] = await db.query(
    `SELECT applications.status, jobs.title, jobs.company
     FROM applications
     JOIN jobs ON applications.job_id = jobs.id
     WHERE applications.user_id = ?
     AND applications.status IN ('accepted', 'rejected')
     AND applications.updated_at > (SELECT last_notif_check FROM users WHERE id = ?)`,
    [userId, userId]
  );
  return rows;
}

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT jobs.id, jobs.title, jobs.company, jobs.location, jobs.description,
       jobs.user_id, jobs.created_at, users.name as employer_name,
       COUNT(applications.id) as applicant_count
       FROM jobs
       JOIN users ON jobs.user_id = users.id
       LEFT JOIN applications ON jobs.id = applications.job_id
       GROUP BY jobs.id, jobs.title, jobs.company, jobs.location, jobs.description,
       jobs.user_id, jobs.created_at, users.name
       ORDER BY jobs.created_at DESC`
    );

    let notifications = [];
    if (req.session.user.role === 'seeker') {
      notifications = await getNotifications(req.session.user.id);
      // reset the check time so notifs don't show again
      if (notifications.length > 0) {
        await db.query('UPDATE users SET last_notif_check = NOW() WHERE id = ?', [req.session.user.id]);
      }
    }

    res.render('jobs/index', { jobs, user: req.session.user, notifications });
  } catch (err) {
    console.error(err);
    res.send('Error loading jobs');
  }
});

// GET /jobs/new - post a job form (employer only)
router.get('/new', isLoggedIn, (req, res) => {
  if (req.session.user.role !== 'employer') return res.redirect('/jobs');
  res.render('jobs/new', { user: req.session.user, error: null });
});

// POST /jobs - create job
router.post('/', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'employer') return res.redirect('/jobs');
  const { title, company, location, description } = req.body;
  try {
    await db.query(
      'INSERT INTO jobs (title, company, location, description, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, company, location, description, req.session.user.id]
    );
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('jobs/new', { user: req.session.user, error: 'Something went wrong.' });
  }
});

// GET /jobs/:id - job detail
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT jobs.*, users.name as employer_name FROM jobs JOIN users ON jobs.user_id = users.id WHERE jobs.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.send('Job not found');
    const job = rows[0];

    // check if seeker already applied
    let alreadyApplied = false;
    if (req.session.user.role === 'seeker') {
      const [apps] = await db.query(
        'SELECT * FROM applications WHERE job_id = ? AND user_id = ?',
        [job.id, req.session.user.id]
      );
      alreadyApplied = apps.length > 0;
    }

    res.render('jobs/detail', { job, user: req.session.user, alreadyApplied });
  } catch (err) {
    console.error(err);
    res.send('Error loading job');
  }
});

// GET /jobs/:id/edit
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'employer') return res.redirect('/jobs');
  try {
    const [rows] = await db.query('SELECT * FROM jobs WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
    if (rows.length === 0) return res.send('Not found or unauthorized');
    res.render('jobs/edit', { job: rows[0], user: req.session.user, error: null });
  } catch (err) {
    console.error(err);
    res.send('Error');
  }
});

// POST /jobs/:id/update
router.post('/:id/update', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'employer') return res.redirect('/jobs');
  const { title, company, location, description } = req.body;
  try {
    await db.query(
      'UPDATE jobs SET title=?, company=?, location=?, description=? WHERE id=? AND user_id=?',
      [title, company, location, description, req.params.id, req.session.user.id]
    );
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.send('Error updating job');
  }
});

// POST /jobs/:id/delete
router.post('/:id/delete', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'employer') return res.redirect('/jobs');
  try {
    // delete applications first, then the job
    await db.query('DELETE FROM applications WHERE job_id = ?', [req.params.id]);
    await db.query('DELETE FROM jobs WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.send('Error deleting job: ' + err.message);
  }
});

module.exports = router;