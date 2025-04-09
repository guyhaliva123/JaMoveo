"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/lib/websocket-context";

export default function LiveAdminPage() {
  const { socket, currentSong } = useWebSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to top when a new song is selected.
  useEffect(() => {
    if (currentSong) {
      scrollRef.current?.scrollTo(0, 0);
    }
  }, [currentSong]);

  // Listen for remote scroll commands and rehearsal quit events.
  useEffect(() => {
    if (!socket) return;

    socket.on("scrollTo", (y: number) => {
      scrollRef.current?.scrollTo(0, y);
    });

    // When the rehearsal is ended, force a full page reload to the /admin route.
    socket.on("rehearsalEnded", () => {
      window.location.href = "/admin";
    });

    return () => {
      socket.off("scrollTo");
      socket.off("rehearsalEnded");
    };
  }, [socket]);

  // Fallback: if currentSong becomes null, also force redirect.
  useEffect(() => {
    if (!currentSong) {
      window.location.href = "/admin";
    }
  }, [currentSong]);

  // Emit scroll position whenever admin scrolls.
  const handleScroll = () => {
    if (scrollRef.current) {
      socket?.emit("syncScroll", scrollRef.current.scrollTop);
    }
  };

  // When admin clicks End Rehearsal, emit the quit event.
  const handleQuit = () => {
    socket?.emit("quitRehearsal");
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100 overflow-auto relative"
    >
      {currentSong ? (
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

          <button
            onClick={handleQuit}
            className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition-colors duration-200"
          >
            End Rehearsal
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-700">
              Loading song...
            </h1>
            <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}
