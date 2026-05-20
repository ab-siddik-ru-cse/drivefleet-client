import Link from "next/link";
import Image from "next/image";

import {
  Search,
  ShieldCheck,
  Sparkles,
  Car as CarIcon,
  Zap,
  Crown,
  Truck,
  Award,
  Clock,
  CreditCard,
  Headphones,
  ChevronRight,
  Star,
} from "lucide-react";

import CarCard from "@/components/CarCard";
import { apiServer } from "@/lib/api";

async function getAvailableCars() {
  try {
    const data = await apiServer("/api/cars?limit=6&sort=newest");

    if (!data?.cars) return [];

    return data.cars.filter((c) => c.available);
  } catch (err) {
    console.error("[home] failed to load cars:", err);
    return [];
  }
}

const CATEGORIES = [
  {
    name: "SUV",
    icon: CarIcon,
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    name: "Sedan",
    icon: CarIcon,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  {
    name: "Luxury",
    icon: Crown,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  },
  {
    name: "Electric",
    icon: Zap,
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  },
  {
    name: "Pickup",
    icon: Truck,
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  },
  {
    name: "Hatchback",
    icon: CarIcon,
    color:
      "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400",
  },
];

const FEATURES = [
  {
    icon: Award,
    title: "Verified Owners",
    text: "Every host is identity-checked before listing a car.",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    text: "Confirm rentals instantly without unnecessary waiting.",
  },
  {
    icon: CreditCard,
    title: "No Hidden Fees",
    text: "Transparent pricing with zero surprise charges.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "Dedicated support whenever you need assistance.",
  },
];

const SLIDES = [
  {
    image:
      "https://image.slidesdocs.com/responsive-images/background/car-color-cool-illustration-powerpoint-background_adf9ef0b8e__960_540.jpg",
    title: "Luxury Cars For Every Journey",
    text: "Premium rentals with unbeatable comfort and style.",
  },
  {
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/070/035/675/small/sleek-black-luxury-sports-car-on-showroom-display-with-modern-lighting-photo.jpg",
    title: "Drive Your Dream Car Today",
    text: "Explore top-rated cars from trusted owners.",
  },
  {
    image:
      "https://media.wired.com/photos/63b8d0a771c6b526845f15a6/master/w_1600%2Cc_limit/CES-2023-PEUGEOT_INCEPTION_CONCEPT_2301CN202.jpg",
    title: "Fast Booking. Better Experience.",
    text: "Book in seconds and hit the road instantly.",
  },
];

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

              <div className="absolute inset-0 bg-black/30" />
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

      {/* AVAILABLE CARS */}
      <section className="container mx-auto px-4 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
              Featured Collection
            </p>

            <h2 className="text-4xl font-bold">
              Available Cars
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Explore the newest and most popular rides on DriveFleet.
            </p>
          </div>

          <Link
            href="/cars"
            className="hidden items-center gap-2 text-sm font-semibold text-brand-600 hover:underline md:flex"
          >
            View all
            <ChevronRight size={16} />
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
            <p className="text-gray-500">
              No cars available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car, i) => (
              <CarCard
                key={car._id}
                car={car}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative overflow-hidden bg-gray-50 dark:bg-[#09090B]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-400 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-400 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
              Why Us
            </p>

            <h2 className="text-4xl font-bold">
              Premium Experience
            </h2>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Everything designed to make your rental experience smooth,
              fast, and reliable.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-3xl border border-gray-200 bg-white/70 p-7 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-brand-100 p-4 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                  <Icon size={24} />
                </div>

                <h3 className="text-xl font-semibold">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
            Browse Categories
          </p>

          <h2 className="text-4xl font-bold">
            Find Your Perfect Ride
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            From luxury to electric — choose what fits your journey.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              href={`/cars?type=${encodeURIComponent(name)}`}
              className="group rounded-3xl border border-gray-200 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${color}`}
              >
                <Icon size={28} />
              </div>

              <h3 className="font-semibold group-hover:text-brand-600">
                {name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="relative overflow-hidden rounded-[10px] px-8 py-20 text-center text-white shadow-sm">
          {/* BG IMAGE */}
          <Image
            src="https://media.wired.com/photos/63b8d0a771c6b526845f15a6/master/w_1600%2Cc_limit/CES-2023-PEUGEOT_INCEPTION_CONCEPT_2301CN202.jpg"
            alt="CTA Background"
            fill
            className="object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/65" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-4xl font-extrabold md:text-5xl">
              Ready To Hit The Road?
            </h2>

            <p className="mt-5 text-lg text-white/80">
              Browse premium cars and experience a smarter way to rent.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/cars"
                className="rounded-2xl bg-white px-7 py-4 font-semibold text-black transition hover:scale-105"
              >
                Explore Cars
              </Link>

              <Link
                href="/add-car"
                className="rounded-2xl border border-white/30 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Become A Host
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}