import Link from "next/link";
import { Car, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

// Modern "X" logo (formerly Twitter) — Lucide doesn't have it, so we use raw SVG
function XLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-extrabold text-brand-700 dark:text-brand-500">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
              <Car size={18} />
            </span>
            <span className="text-lg">DriveFleet</span>
          </Link>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Rent a car your way. Trusted owners, transparent pricing, instant booking.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="footer-link">Home</Link></li>
            <li><Link href="/cars" className="footer-link">All Cars</Link></li>
            <li><Link href="/add-car" className="footer-link">List Your Car</Link></li>
            <li><Link href="/my-bookings" className="footer-link">My Bookings</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> Gulshan Avenue, Dhaka 1212, Bangladesh</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +880 1700 000000</li>
            <li className="flex items-center gap-2"><Mail size={14} /> hello@drivefleet.app</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">Follow</h3>
          <div className="flex gap-2">
            <a href="#" aria-label="Facebook" className="social-icon"><Facebook size={16} /></a>
            <a href="#" aria-label="X" className="social-icon"><XLogo size={16} /></a>
            <a href="#" aria-label="Instagram" className="social-icon"><Instagram size={16} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-4 text-center text-xs text-gray-500 dark:border-gray-800">
        © {new Date().getFullYear()} DriveFleet. All rights reserved.
      </div>
    </footer>
  );
}
