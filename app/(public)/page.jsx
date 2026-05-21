import Link from "next/link";
import {
  Search, ShieldCheck, Sparkles,
  Car as CarIcon, Zap, Crown, Truck,
  Award, Clock, CreditCard, Headphones,
} from "lucide-react";
import CarCard from "@/components/CarCard";
import { apiServer } from "@/lib/api";

/**
 * Fetch the most recent 6 available cars from drivefleet-server.
 * Runs on the server so the first paint includes real data (SEO friendly,
 * no client roundtrip).
 */
async function getAvailableCars() {
  // No cookie needed — listing is public.
  const data = await apiServer("/api/cars?limit=6&sort=newest");
  if (!data?.cars) return [];
  // Server returns all cars including unavailable; filter for the home preview.
  return data.cars.filter((c) => c.available);
}

const CATEGORIES = [
  { name: "SUV", icon: CarIcon, color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  { name: "Sedan", icon: CarIcon, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { name: "Luxury", icon: Crown, color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  { name: "Electric", icon: Zap, color: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400" },
  { name: "Pickup", icon: Truck, color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { name: "Hatchback", icon: CarIcon, color: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" },
];

const FEATURES = [
  { icon: Award, title: "Verified Owners", text: "Every host is identity-checked before they can list a car." },
  { icon: Clock, title: "Instant Booking", text: "Confirm your rental in under a minute. No callbacks, no waiting." },
  { icon: CreditCard, title: "No Hidden Fees", text: "What you see on the listing is exactly what you pay. Promise." },
  { icon: Headphones, title: "24/7 Support", text: "Stuck on the road? Our team is one call away, day or night." },
];

export default async function HomePage() {
  const cars = await getAvailableCars();

  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white">
        <div className="container mx-auto grid gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center">
            <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <Sparkles size={14} /> Drive anywhere, anytime
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Rent a car your way.
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/85">
              Browse hundreds of vehicles from trusted owners. Book in seconds. Hit the road in style.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cars" className="btn-primary !bg-white !text-brand-700 hover:!bg-gray-100">
                <Search size={16} /> Explore Cars
              </Link>
              <Link href="/add-car" className="btn-outline !border-white/40 !bg-white/10 !text-white hover:!bg-white/20">
                List Your Car
              </Link>
            </div>
          </div>

          <div className="hidden items-center justify-center md:flex">
            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">
              <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/20">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={28} />
                  <div>
                    <p className="font-semibold">Secure & Verified</p>
                    <p className="text-sm text-white/70">JWT-protected bookings</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-2xl font-bold">500+</p><p className="text-xs text-white/70">Cars</p></div>
                  <div><p className="text-2xl font-bold">50+</p><p className="text-xs text-white/70">Cities</p></div>
                  <div><p className="text-2xl font-bold">10k+</p><p className="text-xs text-white/70">Happy renters</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic — Available Cars from server */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Available Cars</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Fresh listings from our community of owners.
            </p>
          </div>
          <Link href="/cars" className="hidden text-sm font-semibold text-brand-600 hover:underline md:inline">
            View all →
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-700">
            <p className="text-gray-500">
              No cars listed yet. Be the first to{" "}
              <Link href="/add-car" className="font-semibold text-brand-600 hover:underline">
                list your car
              </Link>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car, i) => (<CarCard key={car._id} car={car} index={i} />))}
          </div>
        )}
      </section>

      {/* Static — Why Choose Us */}
      <section className="bg-gray-50 dark:bg-gray-950/50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Why Choose DriveFleet</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Built for travelers who value time, transparency, and great service.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card text-center">
                <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-500">
                  <Icon size={22} />
                </span>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Static — Popular Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Popular Categories</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find the perfect ride for any occasion.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              href={`/cars?type=${encodeURIComponent(name)}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${color}`}>
                <Icon size={22} />
              </span>
              <span className="text-sm font-semibold group-hover:text-brand-600">{name}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
