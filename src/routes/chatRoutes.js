const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('chat', { title: 'Welcome to the Main Chat Room' });
});

module.exports = router;
