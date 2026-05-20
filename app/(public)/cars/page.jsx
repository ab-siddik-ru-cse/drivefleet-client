"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";

import CarCard from "@/components/CarCard";
import Spinner from "@/components/Spinner";
import { CAR_TYPES } from "@/lib/constants";
import { api } from "@/lib/api";

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const initialTypes = searchParams.getAll("type");
  const initialSort = searchParams.get("sort") ?? "newest";

  const [q, setQ] = useState(initialQ);
  const [debouncedQ, setDebouncedQ] = useState(initialQ);
  const [selectedTypes, setSelectedTypes] = useState(initialTypes);
  const [sort, setSort] = useState(initialSort);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedQ) params.set("q", debouncedQ);

    selectedTypes.forEach((t) => params.append("type", t));

    if (sort !== "newest") params.set("sort", sort);

    const query = params.toString();

    router.replace(query ? `/cars?${query}` : "/cars", {
      scroll: false,
    });
  }, [debouncedQ, selectedTypes, sort, router]);

  // Fetch cars
  const fetchCars = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (debouncedQ) params.set("q", debouncedQ);

      selectedTypes.forEach((t) => params.append("type", t));

      params.set("sort", sort);

      const data = await api(`/api/cars?${params.toString()}`);

      setCars(data.cars ?? []);
    } catch (err) {
      console.error(err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, selectedTypes, sort]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Toggle type
  const toggleType = (t) =>
    setSelectedTypes((cur) =>
      cur.includes(t)
        ? cur.filter((x) => x !== t)
        : [...cur, t]
    );

  // Clear all
  const clearAll = () => {
    setQ("");
    setSelectedTypes([]);
    setSort("newest");
  };

  const activeFilterCount =
    selectedTypes.length +
    (debouncedQ ? 1 : 0) +
    (sort !== "newest" ? 1 : 0);

  const resultsLabel = useMemo(() => {
    if (loading) return "Searching premium cars...";
    if (cars.length === 0) return "No cars found";

    return `${cars.length} ${
      cars.length === 1 ? "car" : "cars"
    } available`;
  }, [cars.length, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white dark:from-[#09090B] dark:via-[#09090B] dark:to-black">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gray-200/70 dark:border-gray-800">
        {/* glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur dark:border-gray-800 dark:bg-white/5">
              <Sparkles
                size={15}
                className="text-brand-500"
              />
              Premium Car Collection
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Explore Amazing Cars
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">
              Discover luxury, electric, SUV, and everyday
              vehicles from trusted owners around the city.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-[28px] border border-gray-200 bg-white/80 p-5 shadow-xl shadow-gray-100/50 backdrop-blur dark:border-gray-800 dark:bg-[#111114]/80 dark:shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by car name..."
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-10 text-sm outline-none transition focus:border-brand-500 focus:bg-white dark:border-gray-800 dark:bg-[#18181B] dark:focus:bg-[#1F1F23]"
              />

              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-14 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-brand-500 dark:border-gray-800 dark:bg-[#18181B]"
            >
              <option value="newest">
                Newest First
              </option>

              <option value="price-asc">
                Price: Low to High
              </option>

              <option value="price-desc">
                Price: High to Low
              </option>

              <option value="popular">
                Most Popular
              </option>
            </select>

            {/* Filters button */}
            <button
              onClick={() =>
                setShowFilters((s) => !s)
              }
              className="relative inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold transition hover:bg-gray-100 dark:border-gray-800 dark:bg-[#18181B] dark:hover:bg-[#202024]"
            >
              <SlidersHorizontal size={16} />
              Filters

              {activeFilterCount > 0 && (
                <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter chips */}
          {showFilters && (
            <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
              <div className="flex flex-wrap gap-3">
                {CAR_TYPES.map((t) => {
                  const active =
                    selectedTypes.includes(t);

                  return (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                        active
                          ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                          : "border border-gray-200 bg-white text-gray-700 hover:border-brand-400 hover:text-brand-600 dark:border-gray-700 dark:bg-[#18181B] dark:text-gray-300"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="mt-4 text-sm font-semibold text-brand-600 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-7 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {resultsLabel}
          </p>
        </div>

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="py-20">
              <Spinner />
            </div>
          ) : cars.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-gray-300 bg-white/70 px-6 py-20 text-center dark:border-gray-700 dark:bg-[#111114]/60">
              <h3 className="text-2xl font-bold">
                No Cars Found
              </h3>

              <p className="mt-3 text-gray-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearAll}
                className="mt-6 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {cars.map((car, i) => (
                <CarCard
                  key={car._id}
                  car={car}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}