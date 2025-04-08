"use client";
// Live session page for admin (includes “Quit” button)
import { useEffect, useState } from "react";

export default function LiveAdminPage() {
  const [status, setStatus] = useState("Waiting for players...");

  useEffect(() => {
    const ws = new WebSocket("wss://your-websocket-server.com");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "song_started") {
        setStatus(`Now Playing: ${data.song.title}`);
      }
    };
    return () => ws.close();
  }, []);

  const handleQuit = async () => {
    await fetch("/api/session/current", { method: "DELETE" });
    setStatus("Session Ended");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Live Session (Admin)</h2>
      <p className="mt-2">{status}</p>
      <button
        onClick={handleQuit}
        className="bg-red-500 text-white px-4 py-2 mt-4"
      >
        Quit Session
      </button>
    </div>
  );
}
