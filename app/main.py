from os import path
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

home = path.dirname(path.dirname(__file__))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/", StaticFiles(directory="app/frontend", html=True), name="home")

users = set()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("----------------------------")
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        if data in users:
            await websocket.send_text("Username taken")
        else:
            users.add(data)
            await websocket.send_text("Username available")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8020)
