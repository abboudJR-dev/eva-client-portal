"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, FolderOpen, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface AdminNavProps {
  user: { name: string; email: string };
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
];

export default function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2C2620]/98 backdrop-blur-xl border-b border-[#C5A258]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-[family-name:var(--font-display)] text-[#C5A258] text-lg tracking-wider">
              EVA Interiors
            </Link>
            <span className="text-[0.6rem] tracking-widest uppercase text-[#C8BFB2] bg-white/5 px-2 py-0.5 border border-[#C8BFB2]/20">
              Admin
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase transition-colors ${
                    isActive
                      ? "text-[#C5A258] border-b-2 border-[#C5A258]"
                      : "text-[#C8BFB2] hover:text-[#C5A258]"
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-[#C8BFB2] text-xs">{user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-[#8A8279] hover:text-[#C5A258] transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#C8BFB2]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#2C2620] border-t border-[#C5A258]/10 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm ${
                  isActive ? "text-[#C5A258] bg-[#C5A258]/5" : "text-[#C8BFB2]"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#A65B4A] w-full"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
