// Load environment variables
import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import diveRoutes from './routes/dive.js';
import userRoutes from './routes/user.js';

import logger from './middleware/logger.js';

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL, 
    'http://localhost:5173', // Vite dev
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/dives', diveRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Dive Logger API is running...' });
});

const PORT = process.env.PORT || 4000;

// Start server
const startServer = async () => {
    try {
        // Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Connected to DB & running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

startServer();
