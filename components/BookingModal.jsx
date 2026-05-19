"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, MessageSquare } from "lucide-react";
import { DRIVER_DAILY_FEE } from "@/lib/constants";

function toInputDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BookingModal({ open, car, onClose, onSubmit, submitting }) {
  const today = useMemo(() => toInputDate(new Date()), []);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [driverNeeded, setDriverNeeded] = useState(false);
  const [specialNote, setSpecialNote] = useState("");

  // Reset state every time we open
  useEffect(() => {
    if (open) {
      setStartDate(today);
      setEndDate(today);
      setDriverNeeded(false);
      setSpecialNote("");
    }
  }, [open, today]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && !submitting) onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, submitting]);

  // Live calculations
  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
    if (e < s) return 0;
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  const dailyPrice = Number(car?.dailyPrice ?? 0);
  const carSubtotal = days * dailyPrice;
  const driverSubtotal = driverNeeded ? days * DRIVER_DAILY_FEE : 0;
  const total = carSubtotal + driverSubtotal;

  const canSubmit = days > 0 && !submitting;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ startDate, endDate, driverNeeded, specialNote });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => !submitting && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <h2 id="booking-title" className="text-lg font-semibold">Book this car</h2>
              <button
                onClick={onClose}
                disabled={submitting}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5">
              {/* Car summary */}
              <div className="mb-5 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={car?.imageURL} alt={car?.name} className="h-14 w-20 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{car?.name}</p>
                  <p className="text-xs text-gray-500">${dailyPrice}/day · {car?.type}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="startDate" className="label">
                    <Calendar size={13} className="inline" /> Start date
                  </label>
                  <input
                    id="startDate" type="date" required value={startDate} min={today}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate < e.target.value) setEndDate(e.target.value);
                    }}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="label">
                    <Calendar size={13} className="inline" /> End date
                  </label>
                  <input
                    id="endDate" type="date" required value={endDate} min={startDate || today}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              {/* Driver */}
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                <input
                  type="checkbox" checked={driverNeeded}
                  onChange={(e) => setDriverNeeded(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <User size={14} /> Add a driver
                  </span>
                  <span className="block text-xs text-gray-500">+${DRIVER_DAILY_FEE}/day for a professional driver.</span>
                </span>
              </label>

              {/* Special note */}
              <div className="mt-4">
                <label htmlFor="specialNote" className="label">
                  <MessageSquare size={13} className="inline" /> Special note (optional)
                </label>
                <textarea
                  id="specialNote" rows={3} value={specialNote} maxLength={500}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="e.g., I'd like child seats, or please deliver to the airport."
                  className="input resize-none"
                />
                <p className="mt-1 text-right text-xs text-gray-500">{specialNote.length}/500</p>
              </div>

              {/* Price breakdown */}
              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>${dailyPrice} × {days || 0} {days === 1 ? "day" : "days"}</span>
                  <span>${carSubtotal.toFixed(2)}</span>
                </div>
                {driverNeeded && (
                  <div className="mt-1 flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Driver fee (${DRIVER_DAILY_FEE} × {days || 0})</span>
                    <span>${driverSubtotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base font-bold dark:border-gray-700">
                  <span>Total</span>
                  <span className="text-brand-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={onClose} disabled={submitting} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={!canSubmit} className="btn-primary">
                  {submitting ? "Booking..." : `Confirm booking · $${total.toFixed(2)}`}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
