"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/lib/websocket-context";
import { LogoutButton } from "@/components/auth/logout-button";

export default function PlayerPage() {
  const { currentSong } = useWebSocket();
  const router = useRouter();

  useEffect(() => {
    if (currentSong) {
      router.push("/player/live");
    }
  }, [currentSong, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100">
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Waiting for next song</h1>
          <p className="text-gray-600">
            The admin hasn&apos;t selected a song yet
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
