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
    
    // Send updated paddle position to the server
    sendDataToServer({ type: 'paddle', user: 'self', position: player.x });
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
                sendDataToServer({ type: 'hit', hits: hits });
            }
        }
    } else {
        if (ball.y - ball.radius < opponent.y + opponent.height &&
            ball.x + ball.radius > opponent.x &&
            ball.x - ball.radius < opponent.x + opponent.width) {
            ball.dy *= -1;
            randomizeDirection();
            ballOnUrer = true;
            sendDataToServer({ type: 'hit', hits: hits });
        }
    }

    // Send updated ball position to the server
    sendDataToServer({ type: 'ball', position: { x: ball.x, y: ball.y } });
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

// Extract user_id and room_id from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');
const roomId = urlParams.get('room_id');

// Establish WebSocket connection
const ws = new WebSocket(`ws://${window.location.host}/ws/${roomId}/${userId}`);

ws.onopen = function (event) {
    console.log('WebSocket is open now.');
};

ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log('Message from server: ', data);
    
    // Update game state based on the data received from the server
    if (data.type === 'paddle') {
        if (data.user !== userId) {
            opponent.x = data.position;
        }
    } else if (data.type === 'ball'){
        ball.x = data.position.x;
        ball.y = data.position.y;
    } else if (data.type === 'hit') {
        hits = data.hits;
    }
    };
    
    ws.onclose = function (event) {
        console.log('WebSocket is closed now.');
    };
    
    ws.onerror = function (error) {
        console.error('WebSocket error observed:', error);
    };
    
    // Function to send data to the server
    function sendDataToServer(data) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }
    
    // Game loop
    function gameLoop() {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }
    
    // Event listeners for mouse and touch events
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
    
    // Start the game loop
    gameLoop();
    