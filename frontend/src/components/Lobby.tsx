import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../api/ApiHook";
import { useAppData, useAuthenticatedUser } from "../context/hooks.tsx";

const Lobby = () => {
  const navigate = useNavigate();
  const inProgress = useState(false);
  const { lobbyId } = useParams();
  const { leaveLobby, getLobbyData, startGame } = useApi();
  const { lobbyData, setLobbyData } = useAppData();
  const isMounted = useRef<boolean>(false);
  const { user } = useAuthenticatedUser();

  useEffect(() => {
    const callGetLobbyData = async () => {
      if (!lobbyId) {
        console.log("No lobby id provided");
        return;
      }
      const data = await getLobbyData(lobbyId);
      console.log(data);
      setLobbyData(data);
    };

    if (!isMounted.current) {
      callGetLobbyData();
      isMounted.current = true;
    }
  }, [getLobbyData, lobbyId, setLobbyData]);

  if (!lobbyId) {
    return <h1>Lobby id not provided :o</h1>;
  }

  const callStartGame = () => {
    // Send a signal for others to join the game as well.
    startGame(lobbyId);
    navigate("/game/" + lobbyId);
  };

  const callLeaveLobby = () => {
    leaveLobby(lobbyId);
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-gray-700 text-lg font-bold mb-4">
          Lobby Game Name
        </h2>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-blue-500 text-white uppercase leading-normal">
              <th className="py-3 px-6 text-left">Player Name</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {lobbyData?.players.map((player, index) => (
              <tr
                key={lobbyData.lobbyId + player}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {player}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <button
            onClick={callLeaveLobby}
            className="text-white bg-red-500 hover:bg-red-700 rounded-md shadow-sm font-bold focus:outline-none focus:shadow-outline py-2 px-4 m-4"
          >
            Leave
          </button>
          {lobbyData?.host == user.username && (
            <button
              onClick={callStartGame}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-4"
            >
              {inProgress ? <div>Start</div> : <div>Join</div>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
