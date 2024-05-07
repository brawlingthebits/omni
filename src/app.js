const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
require('dotenv').config(); // Load environment variables at the very beginning

const app = express(); // Initialize the express app

app.use(bodyParser.json()); // Use bodyParser to parse JSON requests
app.use(passport.initialize()); // Initialize passport
require('./config/passport')(passport);  // Ensure passport is properly configured with strategies

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes); // Use user routes

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error details:", err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).send('Something broke!');
});

// Only start the server when not running tests
if (process.env.NODE_ENV !== 'test') {
    const sequelize = require('./config/database');
    sequelize.sync().then(() => {
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    }).catch(err => console.error('Failed to sync db:', err));
}

module.exports = app;
