import { LogoutButton } from "@/components/auth/logout-button";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <p>Player</p>
      <LogoutButton />
    </div>
  );
}
