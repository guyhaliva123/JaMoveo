"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LivePage() {
  const [currentSong, setCurrentSong] = useState<{
    title: string;
    artist: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Here you would implement real-time listening for the current song
    // If the song ends or is removed, redirect back to the waiting page
    const checkCurrentSong = () => {
      // Implement your real-time check here
      // If no song is playing: router.push('/player')
    };

    const interval = setInterval(checkCurrentSong, 1000);
    return () => clearInterval(interval);
  }, [router]);

  if (!currentSong) {
    return null; // or a loading state
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Now Playing</h1>
        <div className="text-xl">
          <p className="font-semibold">{currentSong.title}</p>
          <p className="text-gray-600">{currentSong.artist}</p>
        </div>
      </div>
    </div>
  );
}
