import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import diveRoutes from './routes/dive.js';
import userRoutes from './routes/user.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import { connectDB } from './db.js';

const app = express();

// CORS
const allowedOrigins = [
    process.env.CLIENT_URL,
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Middleware
app.use(helmet()); // Security headers
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(errorHandler);


// Routes
app.use('/api/user', userRoutes);
app.use('/api/dives', diveRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Dive Logger API is running...' });
});

// Start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI); // Connect to MongoDB
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();
