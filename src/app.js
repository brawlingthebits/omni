const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
app.use('/users', userRoutes);
app.use('/chat', chatRoutes);

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('Authentication error - Token required'));
  }

  // Ensure the token starts with 'Bearer ' and split it
  if (token.startsWith('Bearer ')) {
    const actualToken = token.split(' ')[1];
    jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error - Invalid token'));
      }
      console.log("Decoded JWT:", decoded); // This will show you what's in your JWT payload
      socket.decoded = decoded;
      next();
    });
  } else {
    return next(new Error('Token must start with "Bearer "'));
  }
});

io.on('connection', (socket) => {
  console.log(`${socket.decoded.name || "Anonymous"} connected`);
  const userName = socket.decoded && socket.decoded.name ? socket.decoded.name : "Anonymous";
  console.log(`${userName} connected`);
  socket.join("MainRoom");

  socket.on('sendMessage', ({ message, room = "MainRoom" }) => {
    const messageData = { text: message, user: socket.decoded.name || "Anonymous", timestamp: new Date() };
    io.to(room).emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.decoded.name || "Anonymous"} disconnected`);
  });
});

app.use((err, req, res, next) => {
  console.error("Error details:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).send(err.message || 'Something broke!');
});

if (process.env.NODE_ENV !== 'test') {
  const sequelize = require('./config/database');
  sequelize.sync().then(() => {
    server.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  }).catch(err => {
    console.error('Failed to sync db:', err);
  });
}

module.exports = app;
