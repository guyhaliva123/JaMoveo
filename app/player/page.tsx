"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Main player page (“Waiting for next song” state)
export default function PlayerPage() {
  const [currentSong, setCurrentSong] = useState<null | {
    title: string;
    artist: string;
  }>(null);
  const router = useRouter();

  // Here you would implement real-time listening for song selection
  useEffect(() => {
    // Example of listening for song changes
    // You'll need to implement your actual real-time solution (e.g., Socket.io, Server-Sent Events, or Polling)
    const checkForSelectedSong = () => {
      // This is where you'd implement your real-time check
      // When a song is selected, it would set the currentSong and trigger navigation
    };

    // Set up listener
    const interval = setInterval(checkForSelectedSong, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // If a song is selected, redirect to the live page
  useEffect(() => {
    if (currentSong) {
      router.push("/player/live");
    }
  }, [currentSong, router]);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100">
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Waiting for next song</h1>
          <p className="text-gray-600">The admin hasn't selected a song yet</p>
        </div>

        <div className="absolute top-4 right-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
