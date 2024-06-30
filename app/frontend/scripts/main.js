// frontend/scripts/main.js
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const checkButton = document.getElementById('check-username');
    const statusText = document.getElementById('username-status');
    const loginContainer = document.getElementById('login-container');
    const homeContainer = document.getElementById('home-container');
    const websocket = new WebSocket('ws://localhost:8020/ws');


    websocket.onmessage = (event) => {
        statusText.textContent = event.data;
        if (event.data === "Username available") {
            statusText.style.color = "green";
            setTimeout(() => {
                loginContainer.style.display = "none";
                homeContainer.style.display = "block";
            }, 1000);
        } else {
            statusText.style.color = "red";
        }
    };

    checkButton.addEventListener('click', () => {
        const username = usernameInput.value;
        if (username) {
            statusText.textContent = "username in";

            if (websocket.readyState === WebSocket.OPEN) {
                statusText.textContent = "goiing senddddd";
                websocket.send(username);
                statusText.textContent = "sent wowwwwwwwwww";

            } else {
                statusText.textContent = "no connectionnnnnnnnn";
            }
        } else {
            statusText.textContent = "Please enter a username";
            statusText.style.color = "red";
        }
    });

    document.getElementById('btn-games').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>Games</h2><p>Game content goes here.</p>';
    });
    document.getElementById('btn-tournaments').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>Tournaments</h2><p>Tournament content goes here.</p>';
    });
    document.getElementById('btn-news').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>News</h2><p>News content goes here.</p>';
    });
    document.getElementById('btn-friends').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>Friends</h2><p>Friends content goes here.</p>';
    });
    document.getElementById('btn-profile').addEventListener('click', () => {
        document.getElementById('content').innerHTML = '<h2>Profile</h2><p>Profile content goes here.</p>';
    });
});
