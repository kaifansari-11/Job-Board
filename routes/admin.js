const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin middleware
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  res.status(403).send('Access denied');
}

// GET /admin
router.get('/', isAdmin, async (req, res) => {
  const [[{ totalJobs }]]    = await db.query('SELECT COUNT(*) as totalJobs FROM jobs');
  const [[{ totalUsers }]]   = await db.query('SELECT COUNT(*) as totalUsers FROM users');
  const [[{ totalApps }]]    = await db.query('SELECT COUNT(*) as totalApps FROM applications');
  const [[{ totalEmployers }]] = await db.query("SELECT COUNT(*) as totalEmployers FROM users WHERE role='employer'");
  const [jobs]  = await db.query('SELECT jobs.*, users.name as employer_name FROM jobs JOIN users ON jobs.user_id = users.id ORDER BY jobs.created_at DESC');
  const [users] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  res.render('admin/index', {
    user: req.session.user,
    stats: { totalJobs, totalUsers, totalApps, totalEmployers },
    jobs, users
  });
});

// POST /admin/jobs/:id/delete
router.post('/jobs/:id/delete', isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM applications WHERE job_id = ?', [req.params.id]);
    await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.send('Error: ' + err.message);
  }
});

// POST /admin/users/:id/delete
router.post('/users/:id/delete', isAdmin, async (req, res) => {
  try {
    // 1. delete applications BY this user
    await db.query('DELETE FROM applications WHERE user_id = ?', [req.params.id]);
    // 2. delete applications ON jobs posted by this user
    await db.query('DELETE FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE user_id = ?)', [req.params.id]);
    // 3. delete jobs posted by this user
    await db.query('DELETE FROM jobs WHERE user_id = ?', [req.params.id]);
    // 4. now safe to delete user
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.send('Error deleting user: ' + err.message);
  }
});

module.exports = router;