const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/users', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
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
