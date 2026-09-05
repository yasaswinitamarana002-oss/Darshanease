const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/temples', require('./routes/templeRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/crowd', require('./routes/crowdRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        service: 'DarshanEase MERN Backend',
        status: 'Operational',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.send('DarshanEase MERN Backend API is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`DarshanEase Server running on http://localhost:${PORT}`);
});
