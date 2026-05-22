"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function Banner() {
  return (
    <section className="relative h-[95vh] overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1800&auto=format&fit=crop"
        alt="Luxury Car"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Glow */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto flex h-full items-center px-4">
        <div className="max-w-3xl text-white">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur-md">
            <Sparkles size={16} className="text-yellow-400" />
            Premium Car Rental Experience
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-black leading-tight md:text-7xl lg:text-8xl">
            Drive Your
            <span className="block bg-gradient-to-r from-brand-300 to-blue-400 bg-clip-text text-transparent">
              Dream Car
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
            Rent premium, luxury, electric, and everyday vehicles from
            trusted owners with instant booking and zero hidden fees.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-black transition duration-300 hover:scale-105 hover:bg-gray-100"
            >
              <Search size={18} />
              Explore Cars
            </Link>

            <Link
              href="/add-car"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/20"
            >
              List Your Car
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}