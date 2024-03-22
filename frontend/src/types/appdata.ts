export type LobbyListView = {
  lobbyId: string;
  host: string;
  gameName: string;
  playerCount: number;
};

export type LobbyData = {
  lobbyId: string;
  host: string;
  gameName: string;
  players: string[];
  playercount: number;
};

export type MsgData = LobbyListView | LobbyData;
export type MessageHandler = (data: MsgData) => void;

export type MsgMap = {
  "Lobby Data": LobbyData;
  "Lobby List": LobbyListView;
};

export const MsgTypes: Set<string> = new Set(["Lobby Data", "Lobby List"]);
