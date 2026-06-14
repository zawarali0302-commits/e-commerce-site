"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, User, X, Search } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/stores/cart.store";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const navLinks = [
  { label: "Woman", href: "/products?category=woman" },
  { label: "Man", href: "/products?category=man" },
  { label: "Collections", href: "/products" },
  { label: "Sale", href: "/products?sale=true" },
];

const menuItemCls = "text-[10px] tracking-[0.15em] uppercase font-normal text-stone-600 hover:text-stone-900 hover:bg-stone-50 cursor-pointer px-4 py-2.5 transition-colors rounded-none";

export function Navbar() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const displayCount = status === "unauthenticated" ? 0 : cartCount;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const closeDrawer = () => setDrawerOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    setDrawerOpen(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
        <nav className="flex items-center justify-between px-4 md:px-10 py-3.5 md:py-4">

          {/* Left — mobile: hamburger | desktop: nav links */}
          <div className="flex items-center gap-6">
            <button
              className="md:hidden p-1 text-stone-600 hover:text-stone-900 transition-colors"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] tracking-[0.15em] uppercase text-stone-500 hover:text-stone-900 transition-colors font-normal"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center — Logo */}
          <Link
            href="/"
            className="font-serif text-xl md:text-2xl font-light tracking-[0.25em] uppercase text-stone-900 absolute left-1/2 -translate-x-1/2"
          >
            Éclat
          </Link>

          {/* Right — icons */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 text-stone-500 hover:text-stone-900 transition-colors" aria-label="Account">
                  <User size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-none border border-stone-100 shadow-sm bg-white min-w-[160px] p-1"
              >
                {isSignedIn ? (
                  <>
                    <DropdownMenuItem asChild className={menuItemCls}>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className={menuItemCls}>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <div className="border-t border-stone-100 my-1" />
                    <DropdownMenuItem
                      className={menuItemCls + " text-stone-400"}
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild className={menuItemCls}>
                      <Link href="/sign-in">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className={menuItemCls}>
                      <Link href="/sign-up">Create Account</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-1 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <ShoppingBag size={18} />
              {displayCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#2a1f18] text-[#f0ebe3] text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-light">
                  {displayCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="border-t border-stone-100 px-4 md:px-10 py-3 bg-white">
            <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-lg mx-auto">
              <Search size={15} className="text-stone-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-sm font-light text-stone-900 placeholder:text-stone-300 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="text-stone-300 hover:text-stone-600 transition-colors"
              >
                <X size={15} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#f0ebe3] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/50">
              <span className="font-serif text-xl font-light tracking-[0.2em] uppercase text-[#2a1f18]">
                Éclat
              </span>
              <button onClick={closeDrawer} className="text-stone-400 hover:text-stone-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-stone-200/50">
              <form onSubmit={handleSearch} className="flex items-center gap-2 border border-stone-200 bg-white px-3 py-2">
                <Search size={13} className="text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 text-sm font-light text-stone-900 placeholder:text-stone-300 outline-none bg-transparent"
                />
              </form>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  className="py-3 text-sm tracking-[0.15em] uppercase text-stone-700 hover:text-stone-900 font-light border-b border-stone-200/40 last:border-0"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-6 pt-6 border-t border-stone-200/50 flex flex-col gap-1">
                {isSignedIn ? (
                  <>
                    <Link href="/account" onClick={closeDrawer} className="py-3 text-sm tracking-[0.15em] uppercase text-stone-700 hover:text-stone-900 font-light border-b border-stone-200/40">
                      My Account
                    </Link>
                    <Link href="/orders" onClick={closeDrawer} className="py-3 text-sm tracking-[0.15em] uppercase text-stone-700 hover:text-stone-900 font-light border-b border-stone-200/40">
                      My Orders
                    </Link>
                    <Link href="/cart" onClick={closeDrawer} className="py-3 text-sm tracking-[0.15em] uppercase text-stone-700 hover:text-stone-900 font-light border-b border-stone-200/40">
                      My Bag {displayCount > 0 && `(${displayCount})`}
                    </Link>
                    <button
                      onClick={() => { closeDrawer(); signOut({ callbackUrl: "/" }); }}
                      className="py-3 text-left text-sm tracking-[0.15em] uppercase text-stone-400 hover:text-stone-700 font-light"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={closeDrawer} className="py-3 text-sm tracking-[0.15em] uppercase text-stone-700 hover:text-stone-900 font-light border-b border-stone-200/40">
                      Sign In
                    </Link>
                    <Link href="/sign-up" onClick={closeDrawer} className="py-3 text-sm tracking-[0.15em] uppercase text-stone-700 hover:text-stone-900 font-light">
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}