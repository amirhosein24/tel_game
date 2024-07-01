# Room manager to handle user connections
# class RoomManager:
#     def __init__(self):
#         self.active_rooms = {}
#
#     async def connect(self, websocket: WebSocket, room_id: str, user_id: str):
#         await websocket.accept()
#         if room_id not in self.active_rooms:
#             self.active_rooms[room_id] = {}
#         self.active_rooms[room_id][user_id] = websocket
#
#     def disconnect(self, room_id: str, user_id: str):
#         if room_id in self.active_rooms:
#             self.active_rooms[room_id].pop(user_id, None)
#             if not self.active_rooms[room_id]:
#                 self.active_rooms.pop(room_id)
#
#     async def broadcast(self, room_id: str, message: str, sender_id: str):
#         if room_id in self.active_rooms:
#             for user_id, websocket in self.active_rooms[room_id].items():
#                 if user_id != sender_id:
#                     await websocket.send_text(message)
# room_manager = RoomManager()

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path
import json

app = FastAPI()

app.mount("/static", StaticFiles(directory="web_app/static"), name="static")


@app.get("/{user_id}", response_class=HTMLResponse)
async def read_index(user_id: str):
    index_file = Path(__file__).parent / "templates" / "index.html"
    print(index_file)
    return index_file.read_text()

all_data = {"1234": {}}


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()

    print("WebSocket active for user:", user_id)

    try:
        while True:
            datar = await websocket.receive_text()
            message = json.loads(datar)

            if message["type"] == "ball":
                all_data["1234"]["ball"] = message["position"]

            elif message["type"] == "paddle":
                all_data["1234"][user_id] = [message[user_id], websocket]

                for uid in all_data["1234"].keys():
                    if uid != user_id and uid != "ball":
                        await all_data["1234"][uid][1].send_text(json.dumps({
                            "type": "opponent_paddle",
                            "userId": user_id,
                            "x": message[user_id]
                        }))

            print(all_data)

    except WebSocketDisconnect:
        print("WebSocket disconnected for user:", user_id)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8020)

    # uvicorn.run(app, host="0.0.0.0", port=8020)
