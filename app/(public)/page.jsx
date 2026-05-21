import Link from "next/link";
import {
  Search, ShieldCheck, Sparkles,
  Car as CarIcon, Zap, Crown, Truck,
  Award, Clock, CreditCard, Headphones,
} from "lucide-react";
import CarCard from "@/components/CarCard";
import { apiServer } from "@/lib/api";

async function getAvailableCars() {
  const data = await apiServer("/api/cars?limit=6&sort=newest");
  if (!data?.cars) return [];
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

const SLIDES = [
  {
    image:
      "https://media.wired.com/photos/63b8d0a771c6b526845f15a6/master/w_1600%2Cc_limit/CES-2023-PEUGEOT_INCEPTION_CONCEPT_2301CN202.jpg",
    title: "Fast Booking. Better Experience.",
    text: "Book in seconds and hit the road instantly.",
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cars = await getAvailableCars();

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-[95vh] overflow-hidden">
        {/* SLIDER */}
        <div className="absolute inset-0">
          {SLIDES.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 slider-animation"
              style={{
                animationDelay: `${index * 5}s`,
              }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/60" />
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="relative z-10 container mx-auto flex h-full items-center px-4">
          <div className="max-w-3xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
              <Sparkles size={16} />
              Premium Car Rental Platform
            </div>

            <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
              Rent Cars
              <span className="block text-brand-300">
                Without Limits.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
              Discover premium, luxury, electric, and everyday cars from
              trusted owners. Seamless booking experience with complete
              transparency.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-black transition hover:scale-105"
              >
                <Search size={18} />
                Explore Cars
              </Link>

              <Link
                href="/add-car"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                List Your Car
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* STATS */}
            <div className="mt-14 grid max-w-xl grid-cols-3 gap-6">
              <div>
                <h3 className="text-3xl font-bold">500+</h3>
                <p className="text-sm text-white/70">
                  Premium Cars
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">50+</h3>
                <p className="text-sm text-white/70">
                  Cities Covered
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">10k+</h3>
                <p className="text-sm text-white/70">
                  Happy Clients
                </p>
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
