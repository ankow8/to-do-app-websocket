const express = require('express');
const path = require('path');
const socket = require('socket.io');

const tasks =[];

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('This app running on a localhost: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (taskName) => {
    tasks.push(taskName);
    socket.broadcast.emit('addTask', taskName);
  });
  socket.on('removeTask', (indexOfTask) => {
    const task = tasks.find((task) => task.id === indexOfTask);
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', indexOfTask);
  });
});
