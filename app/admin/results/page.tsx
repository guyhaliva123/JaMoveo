"use client";

// Results page that displays search results and starts the rehearsal

import { useSearchStore } from "@/lib/searchStore";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/lib/websocket-context";
import Image from "next/image";
import { SearchInput } from "@/components/ui/searchInput";

interface LyricLine {
  lyrics: string;
  chords?: string;
}

interface SongDetails {
  id: string;
  title: string;
  artist: string;
  lyrics: LyricLine[][];
  image?: string;
}

function SongItem({
  song,
  onSelect,
}: {
  song: SongDetails;
  onSelect: (song: SongDetails) => void;
}) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-md overflow-hidden">
            {song.image ? (
              <Image
                src={song.image}
                alt={`${song.title} album art`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">🎵</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{song.title}</h3>
            <p className="text-sm text-gray-500">{song.artist}</p>
          </div>
        </div>
        <button
          onClick={() => onSelect(song)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Start Rehearsal
        </button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { results, isLoading, searchSongs } = useSearchStore();
  const { socket } = useWebSocket();
  const router = useRouter();

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    await searchSongs(query);
  };

  // when a song is selected in the results page, emit "songSelected" and navigate
  const handleSelectSong = (song: SongDetails) => {
    try {
      socket?.emit("songSelected", song);
      router.push("/admin/live");
    } catch (err) {
      console.error("Error selecting song:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Search Results
        </h1>

        <div className="w-full max-w-2xl mx-auto">
          <SearchInput
            placeholder="Search any song..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow divide-y">
              {results.map((song) => (
                <SongItem
                  key={song.id}
                  song={song}
                  onSelect={handleSelectSong}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No results to display.
          </div>
        )}
      </div>
    </div>
  );
}
