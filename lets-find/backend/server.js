const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const aiRoutes = require('./routes/ai');
const searchInterestRoutes = require('./routes/searchInterests');
const notificationRoutes = require('./routes/notifications');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/search-interests', searchInterestRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database sync and server start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        
        // Sync models (using alter: true for development)
        // In production, migrations are preferred.
        await sequelize.sync({ alter: true });
        console.log('Database models synced.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ FATAL ERROR: Unable to connect to the database!');
        console.error('Error Details:', error.message);
        console.log('\n--- Troubleshooting Tips ---');
        console.log('1. Is PostgreSQL running? (Run: brew services start postgresql)');
        console.log('2. Does the database "findr_db" exist? (Run: psql postgres -c "CREATE DATABASE findr_db;")');
        console.log('3. Are your credentials in backend/.env correct?');
        process.exit(1);
    }
};

startServer();

module.exports = app;
