"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { Car, Menu, X, LogOut, User, Plus, ListChecks, CalendarCheck } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Explore Cars" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/85">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-brand-700 dark:text-brand-500">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
            <Car size={18} />
          </span>
          <span className="text-lg">DriveFleet</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === l.href
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:grid" />

          {!user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="btn-outline !py-2 !text-sm">Login</Link>
              <Link href="/register" className="btn-primary !py-2 !text-sm">Sign up</Link>
            </div>
          ) : (
            <div ref={dropdownRef} className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1.5 hover:border-brand-500 dark:border-gray-700"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {(user.name || user.email)[0]?.toUpperCase()}
                </span>
                <span className="max-w-[140px] truncate text-sm font-medium">{user.name || user.email}</span>
              </button>
              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                    <p className="text-sm font-semibold">{user.name || "User"}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link href="/add-car" className="dropdown-item"><Plus size={15} /> Add Car</Link>
                  <Link href="/my-cars" className="dropdown-item"><ListChecks size={15} /> My Added Cars</Link>
                  <Link href="/my-bookings" className="dropdown-item"><CalendarCheck size={15} /> My Bookings</Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item w-full !text-red-600 hover:!bg-red-50 dark:hover:!bg-red-950/40"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 md:hidden dark:border-gray-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Menu</span>
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="my-2 border-t border-gray-100 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800">
                  Account
                </div>
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-900">
                  <p className="font-semibold">{user.name || "User"}</p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
                <Link href="/add-car" className="dropdown-item"><Plus size={15} /> Add Car</Link>
                <Link href="/my-cars" className="dropdown-item"><ListChecks size={15} /> My Added Cars</Link>
                <Link href="/my-bookings" className="dropdown-item"><CalendarCheck size={15} /> My Bookings</Link>
                <button onClick={handleLogout} className="dropdown-item w-full text-left !text-red-600">
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <Link href="/login" className="btn-outline flex-1 !py-2 !text-sm">Login</Link>
                <Link href="/register" className="btn-primary flex-1 !py-2 !text-sm">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
