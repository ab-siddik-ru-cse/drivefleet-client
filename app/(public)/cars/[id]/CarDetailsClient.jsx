"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft, MapPin, Users, TrendingUp, Calendar,
  CheckCircle2, XCircle, User,
} from "lucide-react";
import BookingModal from "@/components/BookingModal";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";

export default function CarDetailsClient({ car }) {
  const router = useRouter();
  // User comes from auth context (browser-side, reads localStorage token).
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = currentUser?.uid === car.ownerId;
  const created = new Date(car.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const handleBooking = async ({ startDate, endDate, driverNeeded, specialNote }) => {
    setSubmitting(true);
    try {
      await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          carId: car._id,
          startDate, endDate, driverNeeded, specialNote,
        }),
      });
      toast.success("Booking confirmed!");
      setModalOpen(false);
      router.push("/my-bookings");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/cars"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-400"
      >
        <ArrowLeft size={16} /> Back to all cars
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 shadow-md dark:bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={car.imageURL} alt={car.name} className="h-full w-full object-cover" />
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-gray-700 shadow backdrop-blur dark:bg-gray-900/95 dark:text-gray-200">
              {car.type}
            </span>
            {car.available ? (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-sm font-bold text-white shadow">
                <CheckCircle2 size={14} /> Available
              </span>
            ) : (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white shadow">
                <XCircle size={14} /> Unavailable
              </span>
            )}
          </div>

          <div className="mt-8">
            <h1 className="text-3xl font-bold md:text-4xl">{car.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><MapPin size={16} /> {car.pickupLocation}</span>
              <span className="flex items-center gap-1.5"><Users size={16} /> {car.seatCapacity} seats</span>
              <span className="flex items-center gap-1.5"><Calendar size={16} /> Listed {created}</span>
              {car.bookingCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={16} /> {car.bookingCount} bookings
                </span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">About this car</h2>
            <p className="mt-3 whitespace-pre-line text-gray-700 dark:text-gray-300">{car.description}</p>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-500">
                <User size={18} />
              </span>
              <div>
                <p className="text-xs text-gray-500">Listed by</p>
                <p className="font-semibold">{car.ownerName || car.ownerEmail}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="card">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-brand-600">${car.dailyPrice}</span>
              <span className="text-sm text-gray-500">/ day</span>
            </div>

            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle2 size={16} className="text-emerald-600" /> Free cancellation up to 24 hours
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle2 size={16} className="text-emerald-600" /> Includes basic insurance
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle2 size={16} className="text-emerald-600" /> 24/7 roadside support
              </li>
            </ul>

            <div className="mt-6">
              {isOwner ? (
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  This is your listing. Manage it from{" "}
                  <Link href="/my-cars" className="font-semibold underline">My Added Cars</Link>.
                </div>
              ) : !car.available ? (
                <button disabled className="btn-primary w-full !cursor-not-allowed !bg-gray-300 dark:!bg-gray-700">
                  Currently Unavailable
                </button>
              ) : !currentUser ? (
                <Link href={`/login?redirect=/cars/${car._id}`} className="btn-primary w-full">
                  Login to Book
                </Link>
              ) : (
                <button onClick={() => setModalOpen(true)} className="btn-primary w-full">
                  Book Now
                </button>
              )}
            </div>
          </div>
        </motion.aside>
      </div>

      <BookingModal
        open={modalOpen}
        car={car}
        onClose={() => !submitting && setModalOpen(false)}
        onSubmit={handleBooking}
        submitting={submitting}
      />
    </div>
  );
}