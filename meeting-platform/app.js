const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const uuid = require('uuid');
// Add these lines to handle POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const rooms = {};

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId, userName);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId, userName);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${3000}`);
});
