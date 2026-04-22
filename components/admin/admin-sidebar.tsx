"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Image,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Hero Section", href: "/admin/hero", icon: Image },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-stone-100 flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-stone-100">
        <p className="font-serif text-lg font-light tracking-[0.2em] uppercase text-stone-900">
          Éclat
        </p>
        <p className="text-[9px] tracking-[0.2em] uppercase text-stone-400 mt-0.5">
          Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.1em] uppercase font-normal transition-colors rounded-none",
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              )}
            >
              <item.icon size={14} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-stone-100">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.1em] uppercase text-stone-400 hover:text-stone-700 transition-colors"
        >
          <ExternalLink size={14} strokeWidth={1.5} />
          View Store
        </Link>
      </div>
    </aside>
  );
}