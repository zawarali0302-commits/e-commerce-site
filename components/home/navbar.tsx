"use client";

import Link from "next/link";
import { ShoppingBag, Menu, User } from "lucide-react";
import { SearchBar } from "@/components/home/search-bar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useCartStore } from "@/lib/stores/cart.store";


const navLinks = [
  { label: "Woman", href: "/products?category=woman" },
  { label: "Man", href: "/products?category=man" },
  { label: "Collections", href: "/products" },
  { label: "Sale", href: "/products?sale=true" },
];

export function Navbar() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const displayCount = cartCount;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <nav className="flex items-center justify-between px-6 md:px-10 py-4">
        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-1 text-stone-600 hover:text-stone-900">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-[#f0ebe3] border-none">
              <div className="mt-10 flex flex-col gap-6">
                <p className="font-serif text-2xl font-light tracking-[0.2em] uppercase text-[#2a1f18]">
                  Éclat
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm tracking-[0.15em] uppercase text-stone-600 hover:text-stone-900 font-light"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-stone-200 pt-6">
                  {isSignedIn ? (
                    <div className="flex flex-col gap-3">
                      <Link href="/account" className="text-sm tracking-[0.15em] uppercase text-stone-600 hover:text-stone-900 font-light">
                        My Account
                      </Link>
                      <Link href="/orders" className="text-sm tracking-[0.15em] uppercase text-stone-600 hover:text-stone-900 font-light">
                        My Orders
                      </Link>
                      <button
                        onClick={() => signOut({ redirectUrl: "/" })}
                        className="text-left text-sm tracking-[0.15em] uppercase text-stone-400 hover:text-stone-700 font-light"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link href="/sign-in" className="text-sm tracking-[0.15em] uppercase text-stone-600 hover:text-stone-900 font-light">
                        Sign In
                      </Link>
                      <Link href="/sign-up" className="text-sm tracking-[0.15em] uppercase text-stone-600 hover:text-stone-900 font-light">
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop nav links */}
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

        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl md:text-2xl font-light tracking-[0.25em] uppercase text-stone-900 absolute left-1/2 -translate-x-1/2"
        >
          Éclat
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-4 md:gap-5">
          <SearchBar />

          {/* Auth — desktop */}
          <div className="hidden md:block">
            <Link
                href={isSignedIn ? "/account" : "/sign-in"}
                className="text-stone-500 hover:text-stone-900 transition-colors"
                aria-label={isSignedIn ? "My account" : "Sign in"}
              >
                <User size={18} />
              </Link>
          </div>

          <Link
            href="/cart"
            className="relative text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ShoppingBag size={18} />
            {displayCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#2a1f18] text-[#f0ebe3] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-light">
                {displayCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}