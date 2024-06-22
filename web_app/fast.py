from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

# Room manager to handle user connections

#
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
#
#
# room_manager = RoomManager()


@app.get("/home/{user_id}", response_class=HTMLResponse)
async def read_index(user_id: str):
    index_file = Path(__file__).parent / "templates" / "index.html"
    return index_file.read_text()


# @app.websocket("/ws/{room_id}/{user_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
#     await room_manager.connect(websocket, room_id, user_id)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             await room_manager.broadcast(room_id, data, user_id)
#     except WebSocketDisconnect:
#         room_manager.disconnect(room_id, user_id)


# import asyncio
# from fastapi import WebSocketDisconnect

# # ...

# async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
#     await room_manager.connect(websocket, room_id, user_id)
#     try:
#         while True:
#             # Set a timeout of 5 seconds to wait for data from the client
#             data = await asyncio.wait_for(websocket.receive_text(), timeout=5)
#             await room_manager.broadcast(room_id, data, user_id)
#     except WebSocketDisconnect:
#         room_manager.disconnect(room_id, user_id)
#     except asyncio.TimeoutError:
#         # Handle the timeout error here
#         pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8020)
