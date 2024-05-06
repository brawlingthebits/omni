const express = require('express');
const bodyParser = require('body-parser');
const { User, sequelize } = require('./models');

const app = express();
app.use(bodyParser.json());

app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send('Missing required fields');
    }
    const newUser = await User.create({ name, email, password });
    res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/users', async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email']
  });
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['id', 'name', 'email']
  });
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.json(user);
});

app.put('/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await User.destroy({
      where: { id }
    });
    if (deleted) {
      return res.status(204).send('User deleted');
    }
    throw new Error('User not found');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Handle errors centrally
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Only start the server when not running tests
// Initialize the database and start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync().then(() => {
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  }).catch(err => console.error('Failed to sync db:', err));
}

module.exports = app; // Export the app for testing purposes