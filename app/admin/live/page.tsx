"use client";

import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "@/lib/websocket-context";
import { useSession } from "next-auth/react";
import { getUserInstrument } from "@/lib/user";

export default function LiveAdminPage() {
  const { socket, currentSong } = useWebSocket();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [instrument, setInstrument] = useState<string>("");
  const isVocalist = instrument === "VOCALS";

  const fetchUserInstrument = async () => {
    if (!session?.user?.email) return;
    const instrument = await getUserInstrument(session.user.email);
    setInstrument(instrument?.instrument || "");
  };

  useEffect(() => {
    fetchUserInstrument();
  }, [session]);

  // useEffect to automatically scroll to the top of the page when a new song is selected.
  useEffect(() => {
    if (currentSong) {
      scrollRef.current?.scrollTo(0, 0);
    }
  }, [currentSong]);

  // listen for remote scroll commands and rehearsal quit events.
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

  useEffect(() => {
    if (!currentSong) {
      window.location.href = "/admin";
    }
  }, [currentSong]);

  const handleScroll = () => {
    if (scrollRef.current) {
      socket?.emit("syncScroll", scrollRef.current.scrollTop);
    }
  };

  const handleQuit = () => {
    socket?.emit("quitRehearsal");
  };

  // listen to the  socket and session, and emit a joinRehearsal event when both are available.
  useEffect(() => {
    if (socket && session && session.user) {
      socket.emit("joinRehearsal", { instrument: session.user.instrument });
    }
  }, [socket, session]);

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
            {isVocalist && (
              <p className="mt-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full inline-block">
                Vocalist View
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="font-mono text-center font-semibold">
              {currentSong.lyrics.map((line, lineIndex) => (
                <div key={lineIndex} className="mb-4">
                  {/* Only show chords if not vocalist */}
                  {!isVocalist && (
                    <div className="text-blue-600 h-6">
                      {line.map((item, itemIndex) => (
                        <span
                          key={`chord-${itemIndex}`}
                          className="inline-block font-bold"
                          style={{
                            minWidth: `${item.lyrics.length}ch`,
                            marginRight: "1ch",
                          }}
                        >
                          {item.chords || ""}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Lyrics Line - for everyone */}
                  <div>
                    {line.map((item, itemIndex) => (
                      <span
                        key={`lyric-${itemIndex}`}
                        className="inline-block font-bold"
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
