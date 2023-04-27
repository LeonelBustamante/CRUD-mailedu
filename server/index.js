// Requirements:
const express = require('express')
const path = require('path')

// Server
const app = express()
const port = 3000

// Middleware
const router = require('./routes/mainRoutes.js')

// Routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))
app.use('/api', router)


// Server
app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})