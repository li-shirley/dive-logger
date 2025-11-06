require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const diveRoutes = require('./routes/dive')
const userRoutes = require('./routes/user')
const logger = require('./middleware/logger')

const app = express()

/*
todo: handle CORS (currently using proxy in vite config)
const cors = require("cors");

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
*/

// middleware 
app.use(express.json())
app.use(logger)

// routes
app.use('/api/user', userRoutes)
app.use('/api/dives', diveRoutes)

// health Check
app.get('/', (req, res) => {
    res.json({ message: 'Dive Logger API is running...' })
})

const PORT = process.env.PORT || 4000

// start Server
const startServer = async () => {
    try {
        // connect to db
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(PORT, () => {
            console.log(`Connected to DB & running on port ${PORT}`)
        })
    } catch (err) {
        console.error('Database connection failed:', err.message)
        process.exit(1)
    }
}

startServer()

