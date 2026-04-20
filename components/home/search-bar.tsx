"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchAction } from "@/lib/actions/search.actions";
import { SerializedProductWithCategory } from "@/lib/serialize";
import { formatPrice, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SerializedProductWithCategory[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);

    clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const data = await searchAction(value);
        setResults(data);
      });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  const showDropdown = isOpen && (query.length >= 2 || results.length > 0);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button (collapsed) */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="hidden md:flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
          aria-label="Open search"
        >
          <Search size={18} />
        </button>
      )}

      {/* Expanded search input */}
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="hidden md:flex items-center gap-2 border-b border-stone-300 pb-0.5"
        >
          <Search size={14} className="text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search products..."
            className="w-48 text-[12px] text-stone-900 placeholder:text-stone-300 font-light outline-none bg-transparent"
          />
          {isPending ? (
            <Loader2 size={13} className="text-stone-300 animate-spin shrink-0" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClose}
              className="text-stone-300 hover:text-stone-600 transition-colors shrink-0"
            >
              <X size={13} />
            </button>
          ) : null}
        </form>
      )}

      {/* Results dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-stone-100 shadow-lg z-50">
          {isPending && results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <Loader2 size={16} className="text-stone-300 animate-spin mx-auto" />
            </div>
          ) : results.length === 0 && query.length >= 2 ? (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-stone-400 font-light">
                No results for "{query}"
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-stone-50">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-10 aspect-[3/4] bg-stone-100 shrink-0 overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-stone-200" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.1em] uppercase text-stone-400 font-light">
                        {product.category.name}
                      </p>
                      <p className="text-sm font-normal text-stone-900 truncate">
                        {highlightMatch(product.name, query)}
                      </p>
                      <p className="text-xs text-stone-400 font-light mt-0.5">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View all results */}
              {results.length > 0 && (
                <div className="border-t border-stone-100">
                  <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors text-left font-normal"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Highlight matching text in result names
function highlightMatch(text: string, query: string): React.ReactNode {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-amber-100 text-stone-900 font-normal not-italic">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}