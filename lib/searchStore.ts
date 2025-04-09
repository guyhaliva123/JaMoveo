"use client";
import { create } from "zustand";
import songsData from "@/public/data/songs.json";

interface LyricLine {
  lyrics: string;
  chords?: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  image?: string;
  lyrics: LyricLine[][];
}

interface SearchState {
  query: string;
  results: Song[];
  isLoading: boolean;
  setQuery: (query: string) => void;
  setResults: (results: Song[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  searchSongs: (query: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  results: [],
  isLoading: false,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setIsLoading: (isLoading) => set({ isLoading }),
  searchSongs: async (query) => {
    set({ isLoading: true });
    try {
      // Fetch songs data
      const filteredSongs = songsData.songs.filter(
        (song: Song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
      );

      set({ results: filteredSongs, query });
    } catch (error) {
      console.error("Search failed:", error);
      set({ results: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
