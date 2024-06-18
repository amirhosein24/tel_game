const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 800;
let hits = 0;

const paddleWidth = 100, paddleHeight = 10, ballRadius = 10;
let isMouseDown = false;
let ballOnUrer = true;

const player = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: canvas.height - 50 - paddleHeight,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    dx: 5
};

const ai = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: 50,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    dx: 5
};

let ballSpeed = 2;
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    dx: ballSpeed,
    dy: ballSpeed,
    color: '#05edff'
};

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function movePaddle(x) {
    player.x = x - player.width / 2;

    // Ensure paddle stays within canvas bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

let minAngle = 15 * Math.PI / 180; // 30 degrees in radians
let maxAngle = 165 * Math.PI / 180; // 150 degrees in radians

function randomizeDirection() {

    let angle = Math.random() * (maxAngle - minAngle) + minAngle;
    let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    ball.dx = speed * Math.cos(angle) * (Math.random() < 0.5 ? -1 : 1);
    ball.dy = speed * Math.sin(angle) * (Math.random() < 0.5 ? -1 : 1);
}



function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (left and right)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    // Player paddle collision
    if (ballOnUrer) {
        if (ball.y + ball.radius > player.y &&
            ball.y - ball.radius < player.y + player.height &&
            ball.x + ball.radius > player.x &&
            ball.x - ball.radius < player.x + player.width) {
            if (ball.y + ball.radius < player.y + player.height) {
                ball.dy *= -1;
                randomizeDirection();
                hits++;
                ballOnUrer = false

            }
        }
    } else {
        // AI paddle collision
        if (ball.y - ball.radius < ai.y + ai.height &&
            ball.x + ball.radius > ai.x &&
            ball.x - ball.radius < ai.x + ai.width) {
            ball.dy *= -1;
            randomizeDirection();
            ballOnUrer = true
        }
    }
    // AI movement
    ai.x = ball.x - ai.width / 2;
}

function update() {
    moveBall();
    // Increase speed every 10 hits
    if (hits > 0 && hits % 10 === 0) {
        ballSpeed += 1;
        ball.dx = ballSpeed;
        ball.dy = ballSpeed;
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#fff';
    context.font = '20px Arial';
    context.fillText('Hits: ' + hits, canvas.width / 2 - 30, canvas.height / 2);

    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousedown', function (event) {
    isMouseDown = true;
    movePaddle(event.clientX - canvas.getBoundingClientRect().left);
});

canvas.addEventListener('mouseup', function () {
    isMouseDown = false;
});

canvas.addEventListener('mousemove', function (event) {
    if (isMouseDown) {
        movePaddle(event.clientX - canvas.getBoundingClientRect().left);
    }
});

canvas.addEventListener('touchstart', function (event) {
    movePaddle(event.touches[0].clientX - canvas.getBoundingClientRect().left);
    event.preventDefault(); // Prevent scrolling
});

canvas.addEventListener('touchmove', function (event) {
    movePaddle(event.touches[0].clientX - canvas.getBoundingClientRect().left);
    event.preventDefault(); // Prevent scrolling
});

gameLoop();
