import json
import asyncio
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    status,
)

from app.routers.auth import TokenData

from ..dependencies import get_current_user
from ..connection_manager import ConnectionManager, LobbyManager, ManagerBridge
from ..types import messages

router = APIRouter()
connection_manager = ConnectionManager()
lobby_manager = LobbyManager()
bridge = ManagerBridge(
    connection_manager=connection_manager, lobby_manager=lobby_manager
)


@router.websocket("/ws")
async def websocket_connect(
    websocket: WebSocket,
):
    token = websocket.query_params.get("token")
    if token:
        tokenData = await get_current_user(token)
        user = tokenData.username
    else:
        return
    if not user:
        return

    await connection_manager.connect(websocket, user)
    try:
        while True:
            msg = await websocket.receive_text()
            msg = json.loads(msg)

    except WebSocketDisconnect:
        connection_manager.disconnect(user)


@router.post("/subscribe", status_code=status.HTTP_204_NO_CONTENT)
async def subscribe(
    data: messages.SubscriptionData, tokenData: TokenData = Depends(get_current_user)
):
    username = tokenData.username
    if not username:
        raise HTTPException(status_code=404, detail="Username not found")

    connection_manager.subscribe(user=username, topic=data.topic)


@router.post("/unsubscribe", status_code=status.HTTP_204_NO_CONTENT)
async def unsubscribe(
    data: messages.SubscriptionData, tokenData: TokenData = Depends(get_current_user)
):
    username = tokenData.username
    if not username:
        raise HTTPException(status_code=404, detail="Username not found")

    connection_manager.unsubscribe(user=username, topic=data.topic)


@router.post("/createlobby")
async def create_lobby(tokenData: TokenData = Depends(get_current_user)):
    username = tokenData.username
    if not username:
        raise HTTPException(status_code=404, detail="Username not found")
    lobby_ID = await bridge.create_lobby(host=username)
    return {"lobbyId": lobby_ID}


@router.post("/joinlobby", status_code=status.HTTP_204_NO_CONTENT)
async def join_lobby(
    data: messages.JoinLobby, tokenData: TokenData = Depends(get_current_user)
):
    username = tokenData.username
    if not username:
        raise HTTPException(status_code=404, detail="Username not found")
    await bridge.join_lobby(user=username, lobby_ID=data.lobby_ID)
    return None


@router.post("/leavelobby", status_code=status.HTTP_204_NO_CONTENT)
async def leave_lobby(
    data: messages.LeaveLobby, tokenData: TokenData = Depends(get_current_user)
):
    username = tokenData.username
    if not username:
        raise HTTPException(status_code=404, detail="Username not found")
    await bridge.leave_lobby(user=username, lobby_ID=data.lobby_ID)
    return None


@router.post("/getLobbyData")
async def get_lobby_data(
    data: messages.GetLobbyData, tokenData: TokenData = Depends(get_current_user)
):
    lobby_ID = data.lobby_ID
    user = tokenData.username
    if not user:
        raise HTTPException(status_code=404, detail="Username not found")

    # Make sure user is subscribed to topic
    connection_manager.subscribe(user=user, topic=lobby_ID)
    asyncio.create_task(bridge.publish_lobby(lobby_ID=lobby_ID))

    lobby_data = lobby_manager.get_lobby_info(lobby_ID=lobby_ID)
    if lobby_data:
        return lobby_data
    else:
        raise HTTPException(status_code=404, detail="Lobby not found")


@router.post("/startgame", status_code=status.HTTP_204_NO_CONTENT)
async def start_game(
    data: messages.StartGame, tokenData: TokenData = Depends(get_current_user)
):
    lobby_ID = data.lobby_ID
    await bridge.start_game(lobby_ID=lobby_ID)
    return None
