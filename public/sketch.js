var blob;
var id;
var blobs = [];
var food = [];
var zoom = 1;
var socket;
var data;
var attack = false;

function setup() {
    createCanvas(600, 600);
    blob = new Blob(0, 0, 64, generateTeam());
    socket = io.connect('https://feathr-route-feathr.7e14.starter-us-west-2.openshiftapps.com/');
    data = {
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r,
        team: blob.team
    };
    socket.emit('start', data);
    socket.on('heartbeat',
        function(data) {
            console.log("total blobs: " + data[0]);
            console.log("total food: " + data[1]);
        });
    socket.on('transmit_blobs',
        function(data) {
            blobs = data;
        });
    socket.on('transmit_food',
        function(data) {
            food = data;
        });
}

function draw() {
    background(255);
    translate(width / 2, height / 2);
    var newzoom = 64 / blob.r;
    zoom = lerp(zoom, newzoom, 0.1);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);
    if (mouseIsPressed) {
        blob.attacking = true;
    } else {
        blob.attacking = false;
    }
    showGrid();
    data.x = blob.pos.x;
    data.y = blob.pos.y;
    data.r = blob.r;
    data.team = blob.team;
    socket.emit('updateBlob', data);


    //draw food
    for (var i = food.length - 1; i >= 0; i--) {
        if (blob.eats(food[i])) {
            socket.emit('remove_food', food[i].id);
            food.splice(i, 1);
        } else {
            if (food[i].type == 0) {
                fill(20, 200, 20);
            } else if (food[i].type == 1) {
                fill(20, 20, 200);
            } else {
                fill(200, 200, 200);
            }
            strokeWeight(1);
            stroke(0);
            ellipse(food[i].x, food[i].y, food[i].size * 2, food[i].size * 2);
        }
    }




    //draw other blobs and check for collisions
    for (var i = blobs.length - 1; i >= 0; i--) {
        if (socket.id != blobs[i].id) {
            team = blobs[i].team;
            if (team == 0) {
                fill(20, 200, 20);
            } else if (team == 1) {
                fill(20, 20, 200);
            } else {
                fill(200, 200, 200);
            }
            noStroke();
            ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);
            fill(0);
            text(team, blobs[i].x, blobs[i].y);
            if (blob.bounceCountdown == 0 && blob.collide(blobs[i])) {
                blob.repulsionPoint = createVector(blobs[i].x, blobs[i].y);
                blob.bounceCountdown = 20;
            }
        }
    }

    //draw me
    blob.update();
    blob.show();

}

function showGrid() {
    stroke(15);
    noFill();

    strokeWeight(1);
    stroke(150);
    for (var x = -width; x < width; x += 50) {
        line(x, -height, x, height)
    }
    for (var y = -height; y < height; y += 50) {
        line(-width, y, width, y)
    }
    strokeWeight(3);
    rect(-width, -height, width * 2, height * 2);
}

function generateTeam() {
    team = Math.floor(random(0, 2));
    return team;
}
