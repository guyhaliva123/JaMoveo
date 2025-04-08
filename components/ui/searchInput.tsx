"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.ComponentProps<"input"> {
  onSearch?: (query: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState<string>("");

    const handleSearch = () => {
      if (!query.trim()) return;

      if (onSearch) {
        onSearch(query);
        return;
      }

      // Default search behavior
      if (pathname.startsWith("/search") || pathname.startsWith("/profile")) {
        const params = new URLSearchParams(window.location.search);
        params.set("query", query);
        router.replace(`${pathname}?${params.toString()}`);
      } else {
        router.push(`/search/${query}`);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    return (
      <div className="flex items-center justify-center relative">
        <Input
          ref={ref}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "pr-10", // Make room for the search icon
            className
          )}
          {...props}
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          type="button"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
