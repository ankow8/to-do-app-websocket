const express = require('express');
const socket = require('socket.io');

const tasks =[];

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('This server is running on a localhost: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (indexOfTask) => {
    const task = tasks.find((task) => task.id === indexOfTask);
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', indexOfTask);
  });
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});
