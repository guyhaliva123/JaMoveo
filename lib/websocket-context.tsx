"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

export interface SongDetails {
  title: string;
  artist: string;
  lyrics: { lyrics: string; chords?: string }[][];
}

interface WebSocketContextType {
  socket: Socket | null;
  currentSong: SongDetails | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  currentSong: null,
});

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentSong, setCurrentSong] = useState<SongDetails | null>(null);

  useEffect(() => {
    const socketIo = io("http://localhost:3000");
    setSocket(socketIo);

    socketIo.on("connect", () => {
      socketIo.emit("getCurrentSong");
    });

    socketIo.on("songSelected", (data: SongDetails) => {
      setCurrentSong(data);
    });

    socketIo.on("rehearsalEnded", () => {
      setCurrentSong(null);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, currentSong }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
