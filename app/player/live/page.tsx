"use client";

import { useEffect, useRef } from "react";
import { useWebSocket } from "@/lib/websocket-context";

export default function LivePlayerPage() {
  const { socket, currentSong } = useWebSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Redirect to the waiting page if no current song is detected.
  useEffect(() => {
    if (!currentSong) {
      window.location.href = "/player";
    }
  }, [currentSong]);

  // Listen for scroll commands and rehearsal end events.
  useEffect(() => {
    if (!socket) return;

    socket.on("scrollTo", (y: number) => {
      scrollRef.current?.scrollTo(0, y);
    });

    // Force full page reload to /player when rehearsal ends.
    socket.on("rehearsalEnded", () => {
      window.location.href = "/player";
    });

    return () => {
      socket.off("scrollTo");
      socket.off("rehearsalEnded");
    };
  }, [socket]);

  if (!currentSong) return null;

  return (
    <div
      ref={scrollRef}
      className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100 overflow-auto"
    >
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{currentSong.title}</h1>
          <p className="text-xl text-gray-600">{currentSong.artist}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="font-mono">
            {currentSong.lyrics.map((line, lineIndex) => (
              <div key={lineIndex} className="mb-4">
                {/* Chords Line */}
                <div className="text-blue-600 h-6">
                  {line.map((item, itemIndex) => (
                    <span
                      key={`chord-${itemIndex}`}
                      className="inline-block"
                      style={{
                        minWidth: `${item.lyrics.length}ch`,
                        marginRight: "1ch",
                      }}
                    >
                      {item.chords || ""}
                    </span>
                  ))}
                </div>
                {/* Lyrics Line */}
                <div>
                  {line.map((item, itemIndex) => (
                    <span
                      key={`lyric-${itemIndex}`}
                      className="inline-block"
                      style={{ marginRight: "1ch" }}
                    >
                      {item.lyrics}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
