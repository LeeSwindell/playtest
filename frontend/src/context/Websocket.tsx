import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "./hooks";
// import { useNavigate } from "react-router-dom";
import { MsgMap, MessageHandler, MsgTypes } from "../types";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

type WebSocketContextType = {
  socket: WebSocket | null;
  connected: boolean;
  addHandler: (msgType: string, handler: MessageHandler) => void;
  removeHandler: (msgType: string) => void;
};

type MsgType = keyof MsgMap;

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  // const navigate = useNavigate();
  const [handlers, setHandlers] = useState<{
    [msgType: string]: MessageHandler;
  }>({});
  // let x: Set<string> = new Set(['a', 'b', 'c']);

  function isMsgType(type: string): type is MsgType {
    return MsgTypes.has(type as MsgType);
  }

  let url = WS_BASE_URL;
  const token = useAuth().accessToken;
  if (token) {
    url = url + `?token=${encodeURIComponent(token)}`;
  }

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };
    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  // Update handlers
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        if (isMsgType(message.type)) {
          const handler = handlers[message.type];
          console.log("types", typeof message, typeof handler);
          if (handler) {
            handler(message.data);
          }
        } else {
          console.error(`Invalid WebSocket message type. ${message.type}`);
        }
      };
    }
  }, [socket, handlers]);

  function addHandler(msgType: string, handler: MessageHandler): void {
    const newHandlers = { ...handlers };
    newHandlers[msgType] = handler;
    setHandlers(newHandlers);
  }

  function removeHandler(msgType: string): void {
    const newHandlers = { ...handlers };
    delete newHandlers[msgType];
    setHandlers(newHandlers);
  }

  return (
    <WebSocketContext.Provider
      value={{ socket, connected, addHandler, removeHandler }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export { WebSocketContext, WebSocketProvider };
export type { WebSocketContextType };
