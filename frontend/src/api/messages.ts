import { LobbyData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CreateLobbyResponse {
  lobbyId: string;
}

async function createLobby(accessToken: string): Promise<string> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}/createlobby`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An error occurred");
  }
  const data: CreateLobbyResponse = await response.json();
  if (!data.lobbyId) {
    throw new Error("createLobby didn't return a lobbyId");
  }

  return data.lobbyId;
}

async function joinLobby(accessToken: string, lobbyId: string): Promise<void> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}/joinlobby`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ lobbyId: lobbyId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An error occurred");
  }
}

async function leaveLobby(accessToken: string, lobbyId: string): Promise<void> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}/leavelobby`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ lobbyId: lobbyId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An error occurred");
  }
}

async function getLobbyData(
  accessToken: string,
  lobbyId: string,
): Promise<LobbyData> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}/getLobbyData`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ lobbyId: lobbyId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An error occurred");
  }

  return response.json();
}

async function startGame(accessToken: string, lobbyId: string) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}/startgame`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ lobbyId: lobbyId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An error occurred");
  }
}

async function sub(accessToken: string, topic: string) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}/subscribe`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ topic: topic }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An error occurred");
  }
}

async function unsub(accessToken: string, topic: string) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}/unsubscribe`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ topic: topic }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An error occurred");
  }
}

export default {
  createLobby: createLobby,
  joinLobby: joinLobby,
  leaveLobby: leaveLobby,
  getLobbyData: getLobbyData,
  startGame: startGame,
  sub: sub,
  unsub: unsub,
};
