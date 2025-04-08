"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface WebSocketContextType {
  socket: WebSocket | null;
  currentSong: {
    title: string;
    artist: string;
    lyrics: Array<Array<{ lyrics: string; chords?: string }>>;
  } | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  currentSong: null,
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:3001"
    );

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "SONG_SELECTED") {
        setCurrentSong(data.song);
      } else if (data.type === "SONG_ENDED") {
        setCurrentSong(null);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, currentSong }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
