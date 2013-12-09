var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var arduinoio = require("./lib/arduino-io");

var arduinoSerial = new arduinoio.ArduinoSerial();

var socket = null
var sockets = [];
  io.sockets.on('connection', function (socket) {
    sockets.push(socket);
});

arduinoSerial.listener(function (message) {
  console.log('message:' + message);
  if (sockets.length > 0) {
    for (var i = 0 ; i < sockets.length; i++) {
      sockets[i].emit('message', {message: message});
    }
  }
  else {
    console.log('no game listening for events.');
  }
});

server.listen(9002);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


