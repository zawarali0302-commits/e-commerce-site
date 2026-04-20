"use client";

import { usePathname } from "next/navigation";

export function Announcement() {
    const pathname = usePathname();
    if (pathname.startsWith("/admin")) return null;
  return (
    <div className="bg-[#1a1a1a] text-[#e8ddd0] text-center py-2.5 text-[11px] tracking-[0.12em] uppercase font-light">
      New Collection Arriving — Free Shipping on Orders Over PKR 3,000
    </div>
  );
}