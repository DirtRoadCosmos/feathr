// randomWordGenerator credit:
// James Padolsey
// https://j11y.io/javascript/random-word-generator/

function Blob(x, y, r, t) {
  this.pos = createVector(x, y);
  this.repulsionPoint = createVector(0, 0);
  this.r = r;
  this.attacking = false;
  this.team = t;
  this.name = createRandomWord(Math.floor(random(5, 10)));
  this.score = 0;
  this.bounceCountdown = 0;

  this.eats = function(theFood) {
    var d = p5.Vector.dist(this.pos, createVector(theFood.x, theFood.y));
    if (d < this.r + theFood.size) {
      // var sum = this.r * this.r * PI + size.r * size.r * PI;
      // this.r = sqrt(sum / PI);
      if (this.team == theFood.type) {
        this.score += theFood.size;
      } else {
        this.score -= theFood.size;
      }
      return true;
    } else {
      return false;
    }
  }

  this.collide = function(otherBlob) {
    var d = p5.Vector.dist(this.pos, createVector(otherBlob.x, otherBlob.y));
    if (d < this.r + otherBlob.r) {
      return true;
    } else {
      return false;
    }
  }

  this.update = function () {
    if (this.bounceCountdown == 0) {
      var vel = createVector(mouseX-width/2, mouseY-height/2);
      vel.setMag(3);
      this.pos.add(vel);
    } else {
      var vel = createVector(this.repulsionPoint.x-width/2, this.repulsionPoint.y-height/2);
      vel.setMag(this.bounceCountdown/10);
      this.pos.sub(vel);
      this.bounceCountdown--;
    }
    this.constrain();
  }

  this.constrain = function() {
    blob.pos.x = constrain(blob.pos.x, -width, width);
    blob.pos.y = constrain(blob.pos.y, -height, height);
  }

  this.show = function() {
    if (this.team == 0) {
      fill(20, 200, 20);
    } else if (this.team == 1) {
      fill(20, 20, 200);
    } else {
      fill(200, 200, 200);
    }
    if (this.attacking) {
      fill(200, 20, 20);
    }
    strokeWeight(3);
    stroke(0);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    fill(0);
    textAlign(CENTER,CENTER);
    noStroke();
    textSize(15);
    text("team: " + this.team, this.pos.x, this.pos.y - 10);
    text("score: " + this.bounceCountdown, this.pos.x, this.pos.y + 10);
    text(this.name, this.pos.x, this.pos.y - this.r - 15);

  }

  function createRandomWord(length) {
    var consonants = 'bcdfghjklmnpqrstvwxyz',
        vowels = 'aeiou',
        rand = function(limit) {
            return Math.floor(Math.random()*limit);
        },
        i, word='', length = parseInt(length,10),
        consonants = consonants.split(''),
        vowels = vowels.split('');
    for (i=0;i<length/2;i++) {
        var randConsonant = consonants[rand(consonants.length)],
            randVowel = vowels[rand(vowels.length)];
        word += (i===0) ? randConsonant.toUpperCase() : randConsonant;
        word += i*2<length-1 ? randVowel : '';
    }
    return word;
  }
}
