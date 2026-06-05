const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// routes
app.use('/auth', require('./routes/auth'));
app.use('/jobs', require('./routes/jobs'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/apply', require('./routes/apply'));
app.use('/profile', require('./routes/profile'));
app.use('/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.render('index', { user: null });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});