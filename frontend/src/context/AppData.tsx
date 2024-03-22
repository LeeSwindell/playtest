import * as React from "react";
import { LobbyData, LobbyListView } from "../types";

interface AppDataContextType {
  lobbies: LobbyListView[] | null;
  setLobbies: React.Dispatch<React.SetStateAction<LobbyListView[] | null>>;
  lobbyData: LobbyData | null;
  setLobbyData: React.Dispatch<React.SetStateAction<LobbyData | null>>;
}

const AppDataContext = React.createContext<AppDataContextType | undefined>(
  undefined,
);

function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [lobbies, setLobbies] = React.useState<LobbyListView[] | null>(null);
  const [lobbyData, setLobbyData] = React.useState<LobbyData | null>(null);

  const value = { lobbies, setLobbies, lobbyData, setLobbyData };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export { AppDataProvider, AppDataContext };
export type { AppDataContextType };
