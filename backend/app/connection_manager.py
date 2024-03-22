import uuid
from typing import Dict, List
from fastapi import WebSocket


class LobbyMember:
    def __init__(self, user_id: str):
        self.user_id = user_id


class Lobby:
    def __init__(self, lobby_ID: str, lobby_name: str, host: str):
        self.lobby_ID = lobby_ID
        self.lobby_name = lobby_name
        self.host = host
        self.members: List[str] = []
        self.in_progress: bool = False

    def add_member(self, user_id: str):
        if user_id not in self.members:
            self.members.append(user_id)

    def remove_member(self, user_id: str):
        if user_id in self.members:
            self.members.remove(user_id)

    def get_info(self):
        return {
            "lobbyId": self.lobby_ID,
            "gameName": self.lobby_name,
            "host": self.host,
            "playerCount": len(self.members),
            "players": self.members,
            "inProgress": self.in_progress,
        }


class LobbyManager:
    def __init__(self):
        self.lobbies: Dict[str, Lobby] = {}

    def create_lobby(self, lobby_ID: str, lobby_name: str, host: str):
        if lobby_ID not in self.lobbies:
            self.lobbies[lobby_ID] = Lobby(lobby_ID, lobby_name, host)
            self.lobbies[lobby_ID].add_member(host)

    def delete_lobby(self, lobby_ID: str):
        if lobby_ID in self.lobbies:
            del self.lobbies[lobby_ID]

    def join_lobby(self, user: str, lobby_ID: str):
        lobby = self.lobbies.get(lobby_ID)
        if lobby:
            lobby.add_member(user)

    def leave_lobby(self, user: str, lobby_ID: str):
        lobby = self.lobbies.get(lobby_ID)
        if lobby:
            lobby.remove_member(user)
            if len(lobby.members) == 0:
                self.delete_lobby(lobby_ID)

    def get_lobby_info(self, lobby_ID: str):
        lobby = self.lobbies.get(lobby_ID)
        return lobby.get_info() if lobby else None

    def list_lobbies(self):
        return [lobby.get_info() for lobby in self.lobbies.values()]

    def start_game(self, lobby_ID: str):
        lobby = self.lobbies.get(lobby_ID)
        if lobby:
            lobby.in_progress = True
        else:
            raise KeyError("Game not found")


class ConnectionManager:
    def __init__(self):
        # {"username": WebSocket}
        self.active_connections: Dict[str, WebSocket] = {}

        # {"topic": "username"}
        self.topics: Dict[str, set[str]] = {"Lobby List": set()}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user: str):
        if user in self.active_connections:
            del self.active_connections[user]
        for topic in self.topics:
            if user in self.topics[topic]:
                self.topics[topic].discard(user)

    def subscribe(self, user: str, topic: str):
        if user not in self.active_connections:
            raise KeyError("User does not have an active connection.")
        else:
            if topic in self.topics:
                self.topics[topic].add(user)
            else:
                self.topics[topic] = set(user)

    def unsubscribe(self, user: str, topic: str):
        if user not in self.active_connections:
            raise KeyError("User does not have an active connection.")
        else:
            if topic in self.topics:
                if user in self.topics[user]:
                    self.topics[topic].discard(user)
                else:
                    raise KeyError(f"{user} was not subscribed to topic {topic}")
            else:
                raise KeyError(f"Topic {topic} does not exist")

    async def publish(self, message: str, topic: str):
        print("broadcasting", message, topic)
        if topic in self.topics:
            for user in self.topics[topic]:
                if user in self.active_connections:
                    await self.active_connections[user].send_text(message)
                else:
                    # unsubscribe the user if they have disconnected.
                    self.unsubscribe(user=user, topic=topic)
        else:
            raise KeyError("Topic does not exist")

    async def publishJSON(self, message: dict, topic: str):
        print("broadcasting", message, topic)
        if topic in self.topics:
            for user in self.topics[topic]:
                if user in self.active_connections:
                    await self.active_connections[user].send_json(message)
                else:
                    # unsubscribe the user if they have disconnected.
                    self.unsubscribe(user=user, topic=topic)
        else:
            raise KeyError("Topic does not exist", topic)

    async def sendUserJson(self, user: str, message: dict[str, str]):
        if user not in self.active_connections:
            print(f"User {user} not found in active connections.")
        else:
            await self.active_connections[user].send_json(message)


class ManagerBridge:
    def __init__(
        self, connection_manager: ConnectionManager, lobby_manager: LobbyManager
    ):
        self.connection_manager: ConnectionManager = connection_manager
        self.lobby_manager: LobbyManager = lobby_manager

    async def join_lobby(self, user: str, lobby_ID: str):
        self.lobby_manager.join_lobby(user=user, lobby_ID=lobby_ID)
        self.connection_manager.subscribe(user=user, topic=lobby_ID)

        lobby_info = self.lobby_manager.get_lobby_info(lobby_ID=lobby_ID)
        if lobby_info:
            await self.connection_manager.publishJSON(
                message=lobby_info, topic=lobby_ID
            )

    async def leave_lobby(self, user: str, lobby_ID: str):
        self.lobby_manager.leave_lobby(user=user, lobby_ID=lobby_ID)
        self.connection_manager.unsubscribe(user=user, topic=lobby_ID)

        lobby_info = self.lobby_manager.get_lobby_info(lobby_ID=lobby_ID)
        if lobby_info:
            await self.connection_manager.publishJSON(
                message=lobby_info, topic=lobby_ID
            )

    async def create_lobby(self, host: str) -> str:
        lobby_name = host + "'s Lobby"
        lobby_ID = str(uuid.uuid4())
        self.lobby_manager.create_lobby(
            lobby_ID=lobby_ID, lobby_name=lobby_name, host=host
        )
        self.connection_manager.subscribe(user=host, topic=lobby_ID)
        await self.publish_lobbies()
        return lobby_ID

    async def start_game(self, lobby_ID: str):
        self.lobby_manager.start_game(lobby_ID=lobby_ID)
        message = {"type": "Start Game", "data": lobby_ID}
        await self.connection_manager.publishJSON(message=message, topic=lobby_ID)

    async def publish_lobbies(self):
        lobbies = self.lobby_manager.list_lobbies()
        if lobbies:
            message = {"type": "Lobby List", "data": lobbies}
            await self.connection_manager.publishJSON(message, "Lobby List")

    async def publish_lobby(self, lobby_ID: str):
        data = self.lobby_manager.get_lobby_info(lobby_ID=lobby_ID)
        if data:
            message = {"type": "Lobby Data", "data": data}
            await self.connection_manager.publishJSON(message=message, topic=lobby_ID)
