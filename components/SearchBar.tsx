"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ placeholder = "Search products..." }: {
    placeholder?: string
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state with the current URL search term (if the page was refreshed)
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        // If empty, remove the 'q' parameter but keep page 1
        if (!searchTerm.trim()) {
            router.push(`?page=1`);
            return;
        }

        // Force the URL to Page 1 and append the search query
        router.push(`?page=1&q=${encodeURIComponent(searchTerm)}`);
        setSearchTerm("");
    };

    return (
        <form onSubmit={handleSearch} className="flex-row md:flex-col w-full max-w-md">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-md lg:rounded-l-md focus:outline-none
                focus:ring-2 focus:ring-emerald-600"
            />
            <button
                type="submit"
                className="px-12 lg:px-4 py-2 mt-2 lg:mt-0 ml-0 lg:ml-3 bg-emerald-600 border border-emerald-600 text-white rounded-md lg:rounded-r-md hover:bg-emerald-500"
            >
                Search
            </button>
        </form>
    )
}