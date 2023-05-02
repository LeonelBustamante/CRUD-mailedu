// Requirements:
const express = require('express');
const path = require('path');
const session = require('express-session');
const router = require('./routes/mainRoutes');
const dotenv = require('dotenv');

// Initialize dotenv
dotenv.config();

// Server
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, '../public')));

// Set headers
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API routes
app.use('/api', router);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server
app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
});
