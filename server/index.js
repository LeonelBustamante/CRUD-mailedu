// Requirements:
const express = require('express')
const path = require('path')
const session = require('express-session');

// Server
const app = express()
const port = 3000

// Middleware
const router = require('./routes/mainRoutes.js')
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))

// Routes
app.use('/api', router)
app.use((req, res, next) => {
    if (!req.user) { res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); }
    next();
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../public/login.html')) })
app.get('/home', (req, res) => { res.sendFile(path.join(__dirname, '../public/index.html')) })
app.get('/logout', (req, res) => { req.session.destroy(() => { res.redirect('/') }) });

// Server
app.listen(port, () => { console.log(`Running at http://localhost:${port}\n\n\n\n\n\n`) })