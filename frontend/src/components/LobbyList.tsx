import { useNavigate } from "react-router-dom";
import { useAuth, useWebSocket } from "../context/hooks";
import { useEffect, useRef, useState } from "react";
import { useApi } from "../api/ApiHook";
import { LobbyListView, MsgData } from "../types";

const LobbyList = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { createLobby, joinLobby, sub, unsub } = useApi();
  const { addHandler, removeHandler } = useWebSocket();
  const [lobbies, setLobbies] = useState<LobbyListView | null>(null);
  const isMounted = useRef(false);

  const setLobbyData = (msgData: MsgData) => {
    const data = msgData as LobbyListView;
    console.log("data:", data);
    setLobbies(data);
  };

  // On mount - subscribe to lobby list, add handlers.
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      sub("Lobby List");
      addHandler("Lobby List", setLobbyData);
    }
  }, [addHandler, sub]);
  //
  // // Call on dismount. Use ref to socket and user to avoid empty dependency array.
  // useEffect(() => {
  //   return () => {
  //     removeHandler("Lobby List");
  //   };
  // }, [removeHandler]);

  const callJoinLobby = (lobbyId: string) => {
    joinLobby(lobbyId);
    navigate(`/lobby/${lobbyId}`);
  };

  const callCreateLobby = async () => {
    const lobbyId = await createLobby();
    navigate(`/lobby/${lobbyId}`);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Host</th>
              <th className="py-3 px-6 text-left">Game</th>
              <th className="py-3 px-6 text-left">Players</th>
              <th className="py-3 px-6 text-left">Join</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {lobbies?.map((lobby, index) => (
              <tr
                key={lobby.lobbyId}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {lobby.host}
                </td>
                <td className="py-3 px-6 text-left">{lobby.gameName}</td>
                <td className="py-3 px-6 text-left">{lobby.playerCount}</td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => callJoinLobby(lobby.lobbyId)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Join
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-3 px-6 text-left">
                <button
                  onClick={() => refreshLobbies()}
                  className="text-white bg-blue-500 hover:bg-blue-700 rounded-md shadow-sm font-bold focus:outline-none focus:shadow-outline py-2 px-4"
                >
                  Refresh
                </button>
              </td>
              <td className="py-3 px-6 text-left"></td>
              <td className="py-3 px-6 text-left">
                <button
                  onClick={() => callCreateLobby()}
                  className="text-white bg-green-500 hover:bg-green-700 rounded-md shadow-sm font-bold focus:outline-none focus:shadow-outline py-2 px-4"
                >
                  Create
                </button>
              </td>
              <td className="py-3 px-6 text-left">
                <button
                  onClick={() => auth.logout()}
                  className="text-white bg-red-500 hover:bg-red-700 rounded-md shadow-sm font-bold focus:outline-none focus:shadow-outline py-2 px-4"
                >
                  Logout
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LobbyList;
