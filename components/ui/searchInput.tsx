"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery = "" }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState<string>(initialQuery);

  const handleSearch = () => {
    if (!query) {
      alert("Missing Query. Please enter a search query.");
      return;
    }

    if (pathname.startsWith("/search") || pathname.startsWith("/profile")) {
      const params = new URLSearchParams(window.location.search);
      params.set("query", query);
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      router.push(`/search/${query}`);
    }
  };

  return (
    <div className="border-2 border-green-100 w-full h-16 px-4 bg-black-100 rounded-2xl flex items-center space-x-4">
      <input
        type="text"
        className="text-base text-green-100 flex-1 font-medium bg-transparent outline-none placeholder-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a Post"
      />
      <button onClick={handleSearch} className="focus:outline-none">
        <Image src="/icons/search2.png" alt="Search" width={32} height={32} />
      </button>
    </div>
  );
};

export default SearchInput;
