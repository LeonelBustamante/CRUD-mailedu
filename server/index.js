// Requirements:
const express = require('express')

// Server
const app = express()
const port = 3000

// Middleware
const router = require('./routes/mainRoutes')

// Routes
app.get('/', router)

// Server
app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})