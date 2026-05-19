"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, TrendingUp } from "lucide-react";

export default function CarCard({ car, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={car.imageURL}
          alt={car.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800";
          }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur dark:bg-gray-900/95 dark:text-gray-200">
          {car.type}
        </span>
        {car.available ? (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Available
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Unavailable
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-bold">{car.name}</h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users size={14} /> {car.seatCapacity} seats
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} /> <span className="line-clamp-1">{car.pickupLocation}</span>
          </span>
          {car.bookingCount > 0 && (
            <span className="flex items-center gap-1">
              <TrendingUp size={14} /> {car.bookingCount} bookings
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="text-2xl font-bold text-brand-600">${car.dailyPrice}</p>
            <p className="text-xs text-gray-500">per day</p>
          </div>
          <Link href={`/cars/${car._id}`} className="btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
