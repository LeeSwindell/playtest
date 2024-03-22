import { useAuthenticatedUser } from "../context/hooks";
import messages from "./messages";

export function useApi() {
  const { accessToken } = useAuthenticatedUser();

  const wrappedApi = {
    createLobby: () => messages.createLobby(accessToken),
    joinLobby: (lobbyId: string) => messages.joinLobby(accessToken, lobbyId),
    leaveLobby: (lobbyId: string) => messages.leaveLobby(accessToken, lobbyId),
    getLobbyData: (lobbyId: string) =>
      messages.getLobbyData(accessToken, lobbyId),
    startGame: (lobbyId: string) => messages.startGame(accessToken, lobbyId),
    sub: (topic: string) => messages.sub(accessToken, topic),
    unsub: (topic: string) => messages.unsub(accessToken, topic),
  };

  return wrappedApi;
}
