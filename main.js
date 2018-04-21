document.addEventListener('DOMContentLoaded', function() {
var c = document.getElementById('canvas'); //canvas html element
var head = document.getElementById('head');
var background = document.getElementById('background');
var ctx = c.getContext('2d');
var size = 40;
var score = document.getElementById('score');
var s = 0;
var sColor = "#ff99e7";
var fColor = "Tomato";
var textColor = "black";

var fruit = {
  x: (Math.floor(Math.random() * c.width / size) * size),
  y: (Math.floor(Math.random() * c.height / size) * size),
  update: function() {
    ctx.fillStyle = fColor; //Redraw Fruit
    ctx.fillRect(fruit.x + size / 4, fruit.y + size / 4, size / 2, size / 2);
  },
    newPos: function(){
    fruit.y = (Math.floor(Math.random() * c.height / size) * size); // Picks a random Position for the fruit
    fruit.x = (Math.floor(Math.random() * c.width / size) * size);
  }
};

var snake = {
  x: Math.ceil((c.width/2)/size)*size,
  y: Math.ceil((c.height/2)/size)*size,
  d: "left",
  nd: "null", //Next direction. Used if two inputs are put on the same tick.
  oldX: 0,
  oldY: 0,
  input: false,
  tail: [],
  update: function() {
    snake.oldX = snake.x;
    snake.oldY = snake.y;
    switch (snake.d) {
      case "left":
        snake.x += -size;
        break;
      case "right":
        snake.x += size;
        break;
      case "up":
        snake.y += -size;
        break;
      case "down":
        snake.y += size;
        break;
      default:
        break;
    } // This code deals with the snake hitting the border.
    if (snake.x >= c.width) {
      snake.x = 0
    };
    if (snake.x < 0) {
      snake.x = (c.width - size);
    };
    if (snake.y >= c.height) {
      snake.y = 0;
    };
    if (snake.y < 0) {
      snake.y = (c.height - size);
    };
    ctx.fillStyle = sColor;
    ctx.fillRect(snake.x, snake.y, size, size);

    if (fruit.x == snake.x && fruit.y == snake.y) { //Checking if fruit is touched
      fruit.newPos();
      s++;
      if (snake.tail.length == 0) {
        snake.tail.push(new tailPiece(snake.oldX, snake.oldY, s - 1))
      } else {
        snake.tail.push(new tailPiece(snake.tail[snake.tail.length - 1].oldX, snake.tail[snake.tail.length - 1].oldY, s - 1))
      }
    }
  }
}

function tailPiece(x, y, order) {
  this.x = x;
  this.y = y;
  this.oldX = x;
  this.oldY = y;
  this.order = order;
  this.update = function() {
    this.oldX = this.x;
    this.oldY = this.y;
    if (order == 0) {
      this.x = snake.oldX;
      this.y = snake.oldY;
    } else {
      this.x = snake.tail[(order - 1)].oldX;
      this.y = snake.tail[(order - 1)].oldY;
    }
    if (this.x == snake.x && this.y == snake.y) {
      reset();
    }
    if(this.x == fruit.x && this.y == fruit.y){
      fruit.newPos();
    }
    ctx.fillStyle = sColor;
    ctx.fillRect(this.x, this.y, size, size);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, c.width, c.height); //clear canvas
  if(s >= 10){
    c.style.backgroundColor = "darkBlue";
    textColor = "white";
    sColor = "DodgerBlue";
    fColor = "SlateBlue";
  } else{
    c.style.backgroundColor = "#CCCCFF"
    textColor = "black"
    sColor = "#ff99e7";
    fColor = "Tomato";
  }
  snake.update();
  fruit.update();
  if (snake.tail.length != 0) {
    for (i = 0; i < (snake.tail.length); i++) {
      snake.tail[i].update();
    }
  }
  //score.innerHTML = "Score: " + s;  //update score
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = textColor;
  ctx.fillText("Score: " + s, 10,30);
	if(snake.input && snake.nd != "null"){ // Allows user to buffer Directions
  	snake.d = snake.nd;
    snake.nd = "null";
    snake.input = false;
	}else{
		snake.input = false;
	}
};

 function reset(){
   snake.x = Math.ceil((c.width/2)/size)*size;
   snake.y = Math.ceil((c.height/2)/size)*size;
   snake.tail = [];
   sColor = "#ff99e7";
   fColor = "Tomato";
   s = 0;
   snake.d = "left";
   fruit.newPos();
 }


document.addEventListener("keydown", function(event) {
if(snake.input == false){
    switch (event.keyCode) {
      case 37:
        if (snake.d != "right" && snake.nd != "right" ) {
          snake.d = "left";
          snake.input = true;
        }
        break;
      case 38:
        if (snake.d != "down" && snake.nd != "down") {
          snake.d = "up";
          snake.input = true;
        }
        break;
      case 39:
        if (snake.d != "left" && snake.nd != "left") {
          snake.d = "right";
          snake.input = true;
        }
        break;
      case 40:
        if (snake.d != "up" && snake.nd != "up") {
          snake.d = "down";
          snake.input = true;
        }
        break;
      default:
        break;
    }
  } else {
      switch (event.keyCode) {
        case 37:
          if (snake.d != "right" && snake.nd != "right" ) {
            snake.nd = "left";
            snake.input = true;
          }
          break;
        case 38:
          if (snake.d != "down" && snake.nd != "down") {
            snake.nd = "up";
            snake.input = true;
          }
          break;
        case 39:
          if (snake.d != "left" && snake.nd != "left") {
            snake.nd = "right";
            snake.input = true;
          }
          break;
        case 40:
          if (snake.d != "up" && snake.nd != "up") {
            snake.nd = "down";
            snake.input = true;
          }
          break;
      /*case 37:
        if (snake.d != "right") {
          snake.nd = "left";
          snake.input = true;
        }
        break;
      case 38:
        if (snake.d != "down") {
          snake.nd = "up";
          snake.input = true;
        }
        break;
      case 39:
        if (snake.d != "left") {
          snake.nd = "right";
          snake.input = true;
        }
        break;
      case 40:
        if (snake.d != "up") {
          snake.nd = "down";
          snake.input = true;
        }
        break;*/
      default:
        break;
    }
  }
})

function format() {
  c.height = (window.innerHeight - window.innerHeight % size - size);
  c.width = (window.innerWidth - window.innerWidth % size - size);
  if(fruit.x >= window.innerWidth || fruit.y >= window.innerHeight){
    fruit.newPos();
  }
};
window.addEventListener('resize', function() {
  format();
})
format();
reset();
setInterval(gameLoop, 125);

}, false);
