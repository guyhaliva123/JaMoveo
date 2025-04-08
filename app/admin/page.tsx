import { LogoutButton } from "@/components/auth/logout-button";
import SearchInput from "@/components/ui/searchInput";

export default function page() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <SearchInput initialQuery="" />
      <LogoutButton />
    </div>
  );
}
