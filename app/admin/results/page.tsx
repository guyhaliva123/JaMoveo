"use client";
// Results page that displays search results
import { useState } from "react";
import { useSearchStore } from "@/lib/searchStore";
import ChordDisplay from "@/components/ChordDisplay";

interface LyricLine {
  lyrics: string;
  chords?: string;
}

interface SongDetails {
  id: string;
  title: string;
  artist: string;
  lyrics: LyricLine[][];
}

export default function ResultsPage() {
  const { results } = useSearchStore();
  const [selectedSongData, setSelectedSongData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = async (song: any) => {
    try {
      // Log the clicked song for debugging
      console.log("Clicked song:", song);

      // Fetch the songs data
      const response = await fetch("/data/songs.json");
      const data = await response.json();

      // Log the fetched data for debugging
      console.log("Fetched data:", data);

      // Find the full song details
      const fullSongData = data.songs.find((s: any) => s.id === song.id);

      // Log the found song data for debugging
      console.log("Found song data:", fullSongData);

      if (fullSongData) {
        setSelectedSongData(fullSongData);
        setIsModalOpen(true);
      } else {
        console.error("Song not found in data");
      }
    } catch (error) {
      console.error("Error fetching song details:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Search Results</h2>

      {/* Debug info */}
      <div className="text-sm text-gray-500 mb-4">
        Number of results: {results.length}
      </div>

      {results.length === 0 ? (
        <p className="text-gray-600">No results to display.</p>
      ) : (
        <ul className="mt-4 grid gap-4">
          {results.map((song) => (
            <li
              key={song.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{song.title}</h3>
                  <p className="text-gray-600">{song.artist}</p>
                  {/* Debug info */}
                  <p className="text-xs text-gray-400">ID: {song.id}</p>
                </div>
                <button
                  onClick={() => handleViewDetails(song)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Chord Display Modal */}
      {selectedSongData && (
        <ChordDisplay
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSongData(null);
          }}
          songData={selectedSongData}
        />
      )}
    </div>
  );
}
