"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import CarCard from "@/components/CarCard";
import Spinner from "@/components/Spinner";
import { CAR_TYPES } from "@/lib/constants";

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

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  // Sync filters to URL so reload + share works
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQ) params.set("q", debouncedQ);
    selectedTypes.forEach((t) => params.append("type", t));
    if (sort !== "newest") params.set("sort", sort);
    const query = params.toString();
    router.replace(query ? `/cars?${query}` : "/cars", { scroll: false });
  }, [debouncedQ, selectedTypes, sort, router]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedQ) params.set("q", debouncedQ);
      selectedTypes.forEach((t) => params.append("type", t));
      params.set("sort", sort);
      const res = await fetch(`${process.env.API_URL}/cars?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setCars(data.cars ?? []);
    } catch (err) {
      console.error(err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, selectedTypes, sort]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const toggleType = (t) =>
    setSelectedTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const clearAll = () => {
    setQ("");
    setSelectedTypes([]);
    setSort("newest");
  };

  const activeFilterCount = selectedTypes.length + (debouncedQ ? 1 : 0) + (sort !== "newest" ? 1 : 0);
  const resultsLabel = useMemo(() => {
    if (loading) return "Searching...";
    if (cars.length === 0) return "No cars found";
    return `${cars.length} ${cars.length === 1 ? "car" : "cars"} found`;
  }, [cars.length, loading]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Explore Cars</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Find the perfect ride from our community of trusted owners.
        </p>
      </div>

      <div className="card mb-6 !p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by car name..."
              className="input pl-10"
              aria-label="Search by car name"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input md:w-48" aria-label="Sort">
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most booked</option>
          </select>

          <button onClick={() => setShowFilters((s) => !s)} className="btn-outline relative md:w-auto">
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Car type</p>
            <div className="flex flex-wrap gap-2">
              {CAR_TYPES.map((t) => {
                const active = selectedTypes.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      active
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="mt-3 text-sm font-semibold text-brand-600 hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{resultsLabel}</p>

      {loading ? (
        <Spinner />
      ) : cars.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
          <p className="text-lg font-semibold">No cars match your filters</p>
          <p className="mt-1 text-sm text-gray-500">Try a different search term or clear some filters.</p>
          <button onClick={clearAll} className="btn-outline mt-4">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, i) => (<CarCard key={car._id} car={car} index={i} />))}
        </div>
      )}
    </div>
  );
}
