"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Calendar, MapPin, User, MessageSquare, X as XIcon,
  CalendarCheck, CalendarX, Wallet, Search,
} from "lucide-react";
import Spinner from "@/components/Spinner";
import ConfirmModal from "@/components/ConfirmModal";

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingCancel, setPendingCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not load your bookings.");
        setBookings([]);
        return;
      }
      setBookings(data.bookings ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Summary stats
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const upcoming = confirmed.filter((b) => new Date(b.startDate) >= today);
    const totalSpent = confirmed.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
    return {
      total: bookings.length,
      upcoming: upcoming.length,
      totalSpent,
    };
  }, [bookings]);

  const handleCancel = async () => {
    if (!pendingCancel) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${pendingCancel._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not cancel booking.");
        return;
      }
      toast.success("Booking cancelled.");
      setBookings((cur) =>
        cur.map((b) => (b._id === pendingCancel._id ? { ...b, status: "cancelled" } : b))
      );
      setPendingCancel(null);
    } catch (err) {
      console.error(err);
      toast.error("Network error.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            All your car rentals in one place.
          </p>
        </div>
        <Link href="/cars" className="btn-outline"><Search size={16} /> Browse cars</Link>
      </div>

      {!loading && bookings.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard icon={CalendarCheck} label="Total bookings" value={stats.total} tone="brand" />
          <SummaryCard icon={Calendar} label="Upcoming" value={stats.upcoming} tone="emerald" />
          <SummaryCard icon={Wallet} label="Total spent" value={`$${stats.totalSpent.toFixed(2)}`} tone="amber" />
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
          <p className="text-lg font-semibold">No bookings yet</p>
          <p className="mt-1 text-sm text-gray-500">When you book a car, it&apos;ll show up here.</p>
          <Link href="/cars" className="btn-primary mt-4"><Search size={16} /> Find a car</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {bookings.map((booking, i) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              index={i}
              onCancel={() => setPendingCancel(booking)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!pendingCancel}
        title="Cancel this booking?"
        message={`Your booking for "${pendingCancel?.carName}" will be cancelled. You won't be charged.`}
        confirmLabel="Yes, cancel"
        cancelLabel="Keep booking"
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => !cancelling && setPendingCancel(null)}
      />
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
  const tones = {
    brand: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  };
  return (
    <div className="card !p-5">
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon size={18} />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, index, onCancel }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isFuture = new Date(booking.startDate) >= today;
  const isCancelled = booking.status === "cancelled";
  const canCancel = !isCancelled && isFuture;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      className="card !p-0"
    >
      <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 sm:aspect-auto sm:rounded-l-2xl dark:bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={booking.carImage}
            alt={booking.carName}
            className="h-full w-full object-cover"
          />
          {isCancelled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                <CalendarX size={12} /> Cancelled
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link
                href={`/cars/${booking.carId}`}
                className="text-lg font-bold hover:text-brand-600"
              >
                {booking.carName}
              </Link>
              <p className="text-xs text-gray-500">{booking.carType}</p>
            </div>
            <span className="text-right">
              <span className="block text-xs text-gray-500">Total</span>
              <span className="text-xl font-bold text-brand-600">${Number(booking.totalPrice).toFixed(2)}</span>
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2 dark:text-gray-300">
            <p className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              {fmtDate(booking.startDate)} → {fmtDate(booking.endDate)}
            </p>
            <p className="flex items-center gap-1.5">
              <span className="text-gray-400">·</span>
              {booking.days} {booking.days === 1 ? "day" : "days"}
              {booking.driverNeeded && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                  <User size={11} /> With driver
                </span>
              )}
            </p>
            <p className="flex items-center gap-1.5 sm:col-span-2">
              <MapPin size={14} className="text-gray-400" /> {booking.pickupLocation}
            </p>
            {booking.specialNote && (
              <p className="flex items-start gap-1.5 text-gray-600 sm:col-span-2 dark:text-gray-400">
                <MessageSquare size={14} className="mt-0.5 shrink-0 text-gray-400" />
                <span className="italic">{booking.specialNote}</span>
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
            <span className="text-xs text-gray-500">
              Booked on {fmtDate(booking.bookingDate)}
            </span>
            {canCancel && (
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/40"
              >
                <XIcon size={13} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
