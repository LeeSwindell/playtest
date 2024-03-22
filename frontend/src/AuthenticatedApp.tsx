import { Routes, Route, Navigate } from "react-router-dom";
import GamePage from "./components/GamePage";
import Lobby from "./components/Lobby";
import LobbyList from "./components/LobbyList";
import { WebSocketProvider } from "./context/Websocket";
import { AppDataProvider } from "./context/AppData";

function AuthenticatedApp() {
  return (
    <AppDataProvider>
      <WebSocketProvider>
        <Routes>
          <Route path="/" element={<LobbyList />} />
          {/* <Route path='/lobbies' element={<LobbyList />} /> */}
          <Route path="/lobby/:lobbyId" element={<Lobby />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WebSocketProvider>
    </AppDataProvider>
  );
}

export default AuthenticatedApp;
