"use client";
// Song search page with input and results list
import { SearchInput } from "@/components/ui/searchInput";
import { useSearchStore } from "@/lib/searchStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { results, isLoading, searchSongs } = useSearchStore();

  useEffect(() => {
    if (query) {
      searchSongs(query);
    }
  }, [query, searchSongs]);

  const handleSearch = async (newQuery: string) => {
    await searchSongs(newQuery);
    router.push(`/admin/search?query=${encodeURIComponent(newQuery)}`);
  };

  return (
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
              <SongItem key={song.id} song={song} />
            ))}
          </div>
        </div>
      ) : query && !isLoading ? (
        <div className="text-center text-gray-500 py-8">
          No songs found for "{query}"
        </div>
      ) : null}
    </div>
  );
}

interface Song {
  id: string;
  title: string;
  artist: string;
  image?: string;
}

function SongItem({ song }: { song: Song }) {
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
        <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
}
