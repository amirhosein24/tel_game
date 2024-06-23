
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const userId = window.location.pathname.split('/').pop();
const websocket = new WebSocket(`ws://127.0.0.1:8020/ws/${userId}`);

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

const opponent = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: 50,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff'
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
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // websocket.send(JSON.stringify({ type: 'move_paddle', userId: userId, x: player.x }));

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

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if (ballOnUrer) {
        if (ball.y + ball.radius > player.y &&
            ball.y - ball.radius < player.y + player.height &&
            ball.x + ball.radius > player.x &&
            ball.x - ball.radius < player.x + player.width) {
            if (ball.y + ball.radius < player.y + player.height) {
                ball.dy *= -1;
                randomizeDirection();
                hits++;
                ballOnUrer = false;
            }
        }
    } else {
        if (ball.y - ball.radius < opponent.y + opponent.height &&
            ball.x + ball.radius > opponent.x &&
            ball.x - ball.radius < opponent.x + opponent.width) {
            ball.dy *= -1;
            randomizeDirection();
            ballOnUrer = true;
        }
    }

    // Send updated ball position to the server
    // websocket.send(JSON.stringify({ type: 'move_ball', ball: { x: ball.x, y: ball.y, dx: ball.dx, dy: ball.dy } }));

}

function update() {
    moveBall();
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
    drawRect(opponent.x, opponent.y, opponent.width, opponent.height, opponent.color);
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
    event.preventDefault();
});

canvas.addEventListener('touchmove', function (event) {
    movePaddle(event.touches[0].clientX - canvas.getBoundingClientRect().left);
    event.preventDefault();
});

// // Extract user_id and room_id from URL
websocket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    if (message.type === 'move_paddle' && message.userId !== userId) {
        opponent.x = message.x;
    } else if (message.type === 'move_ball') {
        ball.x = message.ball.x;
        ball.y = message.ball.y;
        ball.dx = message.ball.dx;
        ball.dy = message.ball.dy;
    }
};
// Establish WebSocket connection

gameLoop();