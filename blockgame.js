var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 1;
var dy = -1;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var score = 0;
var ballColor = "#0095DD";

for(var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, color: getRandomColor() };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

 function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight , paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
} 

function drawBricks() {
    for(var c = 0; c  < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
            var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = bricks[1][r].color;
            ctx.fill();
            ctx.closePath();
        }
      }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
 
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
       } else {
        alert('Game Over!');  
        reloadPage();
         
        }
         
    }

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
    
}

function collisionDetection() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status === 1) {
                if(x + ballRadius > b.x && x < b.x + brickWidth + ballRadius && y + ballRadius > b.y && y < b.y + brickHeight + ballRadius) {
                    dy = -dy;
                    b.status = 0;
                    score += 1;
                    dx += getRandomNumber();
                    dy += getRandomNumber();
                    if(dx === 0) {
                        dx += 1;
                    } else if (dy === 0) {
                        dy += 1;
                    }    
                    ballColor = getRandomColor();
                    if(score === brickRowCount * brickColumnCount) {
                        alert("Congratulations!  You have won the game!!");
                        reloadPage();
                        
                    }
                }
            }
        }
    }
}

function getRandomColor() {
    var color = 'rgb(';
    color += randomRGB() + ',';
    color += randomRGB() + ',';
    color += randomRGB() + ')';
    return color;
}

function randomRGB() {
    return Math.floor(Math.random() * 256 );
 }

 function reloadPage() {
    window.location.reload(true);  
    }

function keyDownHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    }
    else if(e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    }
    else if(e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX - paddleWidth / 2 > 0 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function getRandomNumber() {
    return Math.floor( Math.random() * 1.25 ) + 0.25;
  }

document.addEventListener('touchstart', handleTouchEvent, false);
document.addEventListener('touchmove', handleTouchEvent, false);
document.addEventListener('touchend', handleTouchEvent, false);
document.addEventListener('touchcancel', handleTouchEvent, false);

function handleTouchEvent(e) {
    if (e.touches.length === 0 ) return;
    e.preventDefault();
    e.stopPropagation();
    var touch = e.touches[0];
    paddleX = touch.pageX - canvas.width / 2;
}

draw();
