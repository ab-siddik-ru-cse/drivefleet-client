"use client";

import { useState } from "react";
import { CAR_TYPES } from "@/lib/constants";

export default function CarForm({ initial, submitLabel, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    name: initial?.name ?? "",
    dailyPrice: initial?.dailyPrice ?? "",
    type: initial?.type ?? "",
    imageURL: initial?.imageURL ?? "",
    seatCapacity: initial?.seatCapacity ?? "",
    pickupLocation: initial?.pickupLocation ?? "",
    description: initial?.description ?? "",
    available: initial?.available ?? true,
  });

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="name" className="label">Car name</label>
          <input
            id="name" required value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g., Toyota Corolla 2022"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="dailyPrice" className="label">Daily rent price (USD)</label>
          <input
            id="dailyPrice" type="number" min={1} step="0.01" required value={values.dailyPrice}
            onChange={(e) => set("dailyPrice", e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="45"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="type" className="label">Car type</label>
          <select
            id="type" required value={values.type}
            onChange={(e) => set("type", e.target.value)}
            className="input"
          >
            <option value="" disabled>Select a type</option>
            {CAR_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="imageURL" className="label">Image URL</label>
          <input
            id="imageURL" type="url" required value={values.imageURL}
            onChange={(e) => set("imageURL", e.target.value)}
            placeholder="https://i.ibb.co/..."
            className="input"
          />
          <p className="mt-1.5 text-xs text-gray-500">Use imgbb.com or postimages.org for hosting.</p>
        </div>

        <div>
          <label htmlFor="seatCapacity" className="label">Seat capacity</label>
          <input
            id="seatCapacity" type="number" min={1} max={50} required value={values.seatCapacity}
            onChange={(e) => set("seatCapacity", e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="5"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="pickupLocation" className="label">Pickup location</label>
          <input
            id="pickupLocation" required value={values.pickupLocation}
            onChange={(e) => set("pickupLocation", e.target.value)}
            placeholder="e.g., Dhaka, Gulshan"
            className="input"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="label">Description</label>
          <textarea
            id="description" required rows={4} value={values.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Comfortable family sedan with great fuel efficiency..."
            className="input resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <input
              type="checkbox" checked={values.available}
              onChange={(e) => set("available", e.target.checked)}
              className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span>
              <span className="block text-sm font-medium">Available for booking</span>
              <span className="block text-xs text-gray-500">Uncheck if the car is temporarily unavailable.</span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
