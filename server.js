/*to do: ajust food spawning rate for food eating rate
*/
var blobs = [];
var food = [];
function Blob(id, x, y, r, t) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.team = t;
}
var width = 600;
var height = 600;
var express = require('express');
var app = express();
//var server = app.listen(3000);
var server = app.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);
app.use(express.static('public'));
console.log("my server is running, dude");

var socket = require('socket.io');
var io = socket(server);

setInterval(heartbeat, 5000);
setInterval(transmit_blobs, 50);
setInterval(transmit_food, 50);
setInterval(addFood, 2000);

function heartbeat() {
  io.sockets.emit('heartbeat', [blobs.length, food.length]);
}

function transmit_blobs() {
  io.sockets.emit('transmit_blobs', blobs);
}

function transmit_food() {
  io.sockets.emit('transmit_food', food);
}

io.sockets.on('connection', newConnection);
function newConnection(socket) {
  console.log('new connection: ' + socket.id);
  socket.on('start', function(data) {
    console.log(socket.id + " " + data.r + " " + data.team);
    var blob = new Blob(socket.id, data.x * 2, data.y * 2, data.r, data.team);
    blobs.push(blob);
  }
);
  socket.on('updateBlob',
    function(data) {
      var blob;
      for (var i = 0; i < blobs.length; i++) {
        //console.log(socket.id + ": " + blobs[i].id);;
        if (socket.id == blobs[i].id) {
//          console.log("found one!");
//          console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
          blobs[i].x = data.x;
          blobs[i].y = data.y;
          blobs[i].r = data.r;
        }
      }
      //console.log(socket.id + " " + blob.x + " " + blob.y + " " + blob.r);

    }
  );
  socket.on('remove_food',
    function(id) {
      for (var i = food.length - 1; i >= 0; i--) {
        if (id == food[i].id) {
          food.splice(i, 1);
        }
      }
    });
}

function addFood() {
  var n = 1;
  var prevFoodCount = food.length;
  for (var i = prevFoodCount; i < prevFoodCount + n; i++) {
    var x = Math.floor(Math.random() * width * 2) - width;
    var y = Math.floor(Math.random() * width * 2) - height;
    var size = Math.floor(Math.random() * 6) + 2;
    var type = Math.floor(Math.random() * 2);
    var id = generateUUID();
    food[i] = new Food(x, y, size, type, id);
  }
}

function Food(x, y, size, type, id) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.type = type;
  this.id = id;
}

// https://jsfiddle.net/briguy37/2MVFd/
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid
  }
