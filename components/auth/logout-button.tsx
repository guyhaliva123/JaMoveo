"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClipLoader } from "../ClipLoader";
import { signout } from "@/actions/signout";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        disabled={isLoading}
        variant="destructive"
        className={`bg-red-500 ${className || ""}`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <ClipLoader size={20} color="#ffffff" />
            <span>Logging out...</span>
          </div>
        ) : (
          "Logout"
        )}
      </Button>
    </div>
  );
}
