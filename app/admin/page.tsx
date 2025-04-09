"use client";
// Main admin dashboard (search page + dashboard stats)
import { useEffect } from "react";
import { SearchInput } from "@/components/ui/searchInput";
import { LogoutButton } from "@/components/auth/logout-button";
import { useSearchStore } from "@/lib/searchStore";
import { useRouter } from "next/navigation";
import songsData from "@/public/data/songs.json";
import { useWebSocket } from "@/lib/websocket-context";

export default function AdminDashboard() {
  const router = useRouter();
  const { socket } = useWebSocket(); // get the shared socket
  const { searchSongs } = useSearchStore();
  const totalSongs = songsData.songs.length;

  // Listen for admin's own selection (or any broadcast)…
  useEffect(() => {
    if (!socket) return;

    socket.on("songSelected", () => {
      router.push("/admin/live");
    });
    return () => {
      socket.off("songSelected");
    };
  }, [socket, router]);

  const handleSearch = async (query: string) => {
    await searchSongs(query);
    router.push("/admin/results");
  };

  function StatsCard({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string;
    icon: string;
  }) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="text-2xl mr-4">{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Section */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-xl">
            <SearchInput
              placeholder="Search any song..."
              className="w-full"
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Songs"
            value={totalSongs.toString()}
            icon="🎵"
          />
          <StatsCard title="Active Users" value="45" icon="👥" />
          <StatsCard title="Total Sessions" value="280" icon="📊" />
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500">No recent activity</p>
          </div>
        </div>
      </main>
    </div>
  );
}
