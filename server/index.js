const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/', require('./routes/router'));

app.use((req, res, next) => {
    if (!req.user) { res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); }
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
