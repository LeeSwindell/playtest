import * as React from "react";
import { AuthContextType, AuthContext } from "./AuthProvider";
import { WebSocketContext, WebSocketContextType } from "./Websocket";
import { AppDataContext, AppDataContextType } from "./AppData";

function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function useUser() {
  const { user } = useAuth();
  return user;
}

function useAuthenticatedUser() {
  const { user, accessToken } = useAuth();

  if (
    user === null ||
    user === undefined ||
    accessToken === null ||
    accessToken === undefined
  ) {
    throw new Error("User not authenticated.");
  } else {
    return { user, accessToken };
  }
}

function useWebSocket(): WebSocketContextType {
  const context = React.useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  }
  return context;
}

function useAppData(): AppDataContextType {
  const context = React.useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppDataContext must be used within an AppDataProvider");
  }
  return context;
}

export { useAuth, useUser, useWebSocket, useAppData, useAuthenticatedUser };
