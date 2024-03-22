from pydantic import BaseModel


class JoinLobby(BaseModel):
    lobby_ID: str


class LeaveLobby(BaseModel):
    lobby_ID: str


class GetLobbyData(BaseModel):
    lobby_ID: str


class StartGame(BaseModel):
    lobby_ID: str


class SubscriptionData(BaseModel):
    topic: str
