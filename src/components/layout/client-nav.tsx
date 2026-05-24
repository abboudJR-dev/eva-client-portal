"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CheckCircle, FileText, Calendar, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface ClientNavProps {
  user: { name: string; email: string };
}

const navItems = [
  { href: "/dashboard", label: "Journey", icon: LayoutDashboard },
  { href: "/approvals", label: "Approvals", icon: CheckCircle },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/schedule", label: "Schedule", icon: Calendar },
];

export default function ClientNav({ user }: ClientNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-xl border-b border-[#C5A258]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="font-[family-name:var(--font-display)] text-[#C5A258] text-lg tracking-wider">
            EVA Interiors
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
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
        <div className="md:hidden bg-[#1A1A1A] border-t border-[#C5A258]/10 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
