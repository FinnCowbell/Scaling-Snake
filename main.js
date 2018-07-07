var size = 40;
document.addEventListener('DOMContentLoaded', function() {
var c = document.getElementById('canvas'); //canvas html element
var head = document.getElementById('head');
var background = document.getElementById('background');
var ctx = c.getContext('2d');
var s = 0;
var ci = 0; // colorIndex
var headColor = [
  "#ee88d6", //default
  "#ee3333", //red
  "#ff8200", //orange
  "#ffd800", //yellow
  "#55aa70", //green
  "#3085bf", //blue
  "#4c0184" //purple
  //rainbow afterwards
];
var snakeColor = [
  "#ff99e7",
  "#ff6666",
  "#ffa100",
  "#ffe900",
  "#30bf5e",
  "#309dbf",
  "#6f00c1",
  "Isn't gonna be used because rainbow"
];
var fruitColor = [
  "Tomato",
  "#cc6699",
  "#aa8000",
  "#b3a000",
  "#408054",
  "#407080",
  "#6f00c1"
];
var bgColor = [
  "#ccccff",
  "#ffcccc",
  "#ffc180",
  "#fff9bf",
  "#cfe6d6",
  "#cfe4ff",
  "#ddafff"
]
var textColor = [
  "#000000",
  "#993366",
  "#ff0066",
  "#fff300",
  "#55bb75",
  "#ffffff",
  "#6f00c1"
];

var oSize = size; //used to check if user has changed the size in console. Formats if they did.
var fruit = {
  x: (Math.floor(Math.random() * c.width / size) * size),
  y: (Math.floor(Math.random() * c.height / size) * size),
  update: function() {
    ctx.fillStyle = fruitColor[ci]; //Redraw Fruit
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
  input: 0, //counts inputs per tick. The first input is set to d, the next input is set to nd, other inputs are ignored.
  oldX: 0,
  oldY: 0,
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
    ctx.fillStyle = headColor[ci];
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
    ctx.fillStyle = snakeColor[s < headColor.length * 5 ? ci : ((snake.tail.length - this.order -1) % headColor.length)]; // Checks if it needs to be a rainbow
    ctx.fillRect(this.x, this.y, size, size);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, c.width, c.height); //clear canvas
  ci = (s <= headColor.length * 5 ? Math.floor(s/5) % headColor.length : (snake.tail.length % (snakeColor.length - 1))) // Changes colors every 10 points, loops if it runs out.
  c.style.backgroundColor = bgColor[ci];
  c.style.borderColor = headColor[ci];
  snake.update();
  fruit.update();
  if (snake.tail.length != 0) {
    for (i = 0; i < (snake.tail.length); i++) {
      snake.tail[i].update();
    }
  }
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = textColor[ci];
  ctx.fillText(`Score: ${s}`, 10,30);
	if(snake.input >= 2 ){ // Allows user to buffer Directions
  	snake.d = snake.nd;
		snake.nd = "null";
		snake.input = 0;
	}else{
		snake.input = 0;
	}
	if(size != oSize){ //Allows console-side Size changing to work. May add a way to do so in the UI as well.
		format();
		fruit.update();
		oSize = size;
	}
};

 function reset(){
   snake.x = Math.ceil((c.width/2)/size)*size;
   snake.y = Math.ceil((c.height/2)/size)*size;
   snake.tail = [];
   ci = 0;
   s = 0;
   snake.d = "left";
   fruit.newPos();
 }


document.addEventListener("keydown", function(event) {
if(snake.input < 1){
    switch (event.keyCode) {
      case 37://left arrow
			case 65://a
        if (snake.d != "right" && snake.nd != "right" ) {
          snake.d = "left";
				  snake.input++
        }
        break;
      case 38://up arrow
			case 87://w
        if (snake.d != "down" && snake.nd != "down") {
          snake.d = "up";
					snake.input++
        }
        break;
      case 39://right arrow
			case 68://d
        if (snake.d != "left" && snake.nd != "left") {
          snake.d = "right";
					snake.input++
        }
        break;
      case 40://down arrow
			case 83://s
        if (snake.d != "up" && snake.nd != "up") {
          snake.d = "down";
					snake.input++
        }
        break;
      default:
        break;
    }
} else if(snake.input < 2) {
    switch (event.keyCode) {
      case 37:
        if (snake.d != "right") {
          snake.nd = "left";
					snake.input++
        }
        break;
      case 38:
        if (snake.d != "down") {
          snake.nd = "up";
					snake.input++
        }
        break;
      case 39:
        if (snake.d != "left") {
          snake.nd = "right";
					snake.input++
        }
        break;
      case 40:
        if (snake.d != "up") {
          snake.nd = "down";
					snake.input++;
        }
        break;
    default:
      break;
    }
  }
})

function format() {
  c.oldHeight= c.height
  c.oldWidth = c.width
  c.height = (window.innerHeight - window.innerHeight % size - size);
  c.width = (window.innerWidth - window.innerWidth % size - size);
  if(c.oldHeight != c.height || c.oldWidth != c.width){
    fruit.newPos();
  }
};
window.addEventListener('resize', function() {
  format();
})
format();
reset();
setInterval(gameLoop, 100);

}, false);
