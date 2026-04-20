"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_LINKS = {
  Shop: [
    { label: "Woman", href: "/products?category=woman" },
    { label: "Man", href: "/products?category=man" },
    { label: "New In", href: "/products?sort=newest" },
    { label: "Sale", href: "/products?sale=true" },
    { label: "Collections", href: "/products" },
  ],
  Help: [
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Track Order", href: "/track-order" },
    { label: "Contact Us", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Stores", href: "/stores" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="px-6 md:px-10 pt-14 pb-8 border-t border-stone-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-xl font-light tracking-[0.2em] uppercase mb-3">
            Éclat
          </p>
          <p className="text-xs text-stone-400 font-light leading-relaxed max-w-[200px]">
            Refined Pakistani fashion, crafted for the modern woman.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-stone-900 mb-4 font-medium">
              {heading}
            </h4>
            <nav className="flex flex-col gap-2.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-stone-400 hover:text-stone-900 transition-colors font-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-100">
        <p className="text-[11px] text-stone-400 font-light order-2 md:order-1">
          © 2026 Éclat. All rights reserved.
        </p>
        <div className="flex gap-2 order-1 md:order-2">
          {["Visa", "Mastercard", "JazzCash", "Easypaisa", "COD"].map((m) => (
            <span
              key={m}
              className="px-2.5 py-1 bg-stone-50 border border-stone-100 text-[9px] tracking-[0.1em] text-stone-400 rounded-sm"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}