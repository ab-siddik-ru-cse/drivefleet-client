"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, MapPin, Users, Eye } from "lucide-react";
import Spinner from "@/components/Spinner";
import ConfirmModal from "@/components/ConfirmModal";
import { api } from "@/lib/api";

export default function MyCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      // ?owner=me on drivefleet-server filters to cars owned by req.user (JWT).
      const data = await api("/api/cars?owner=me");
      setCars(data.cars ?? []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not load your cars.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      // Server checks ownership (car.ownerId === req.user.uid) before deleting.
      await api(`/api/cars/${pendingDelete._id}`, { method: "DELETE" });
      toast.success("Car deleted.");
      setCars((cur) => cur.filter((c) => c._id !== pendingDelete._id));
      setPendingDelete(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not delete car.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">My Added Cars</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage the cars you&apos;ve listed.</p>
        </div>
        <Link href="/add-car" className="btn-primary"><Plus size={16} /> Add a Car</Link>
      </div>

      {loading ? (
        <Spinner />
      ) : cars.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
          <p className="text-lg font-semibold">You haven&apos;t added any cars yet</p>
          <p className="mt-1 text-sm text-gray-500">List your first vehicle and start earning.</p>
          <Link href="/add-car" className="btn-primary mt-4"><Plus size={16} /> Add your first car</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {cars.map((car) => (
              <MobileCard key={car._id} car={car} onDelete={() => setPendingDelete(car)} />
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:bg-gray-950 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3">Car</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Price/day</th>
                  <th className="px-5 py-3">Bookings</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {cars.map((car) => (
                  <tr key={car._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={car.imageURL} alt={car.name} className="h-12 w-16 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold">{car.name}</p>
                          <p className="text-xs text-gray-500">
                            <MapPin size={11} className="mr-0.5 inline" /> {car.pickupLocation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold dark:bg-gray-800">
                        {car.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-brand-600">${car.dailyPrice}</td>
                    <td className="px-5 py-3">{car.bookingCount ?? 0}</td>
                    <td className="px-5 py-3">
                      {car.available ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/cars/${car._id}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                          title="View"
                        ><Eye size={15} /></Link>
                        <Link
                          href={`/my-cars/${car._id}/edit`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                          title="Edit"
                        ><Pencil size={15} /></Link>
                        <button
                          onClick={() => setPendingDelete(car)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/40"
                          title="Delete"
                        ><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete this car?"
        message={`"${pendingDelete?.name}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Yes, delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setPendingDelete(null)}
      />
    </div>
  );
}

function MobileCard({ car, onDelete }) {
  return (
    <div className="card !p-4">
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={car.imageURL} alt={car.name} className="h-20 w-28 shrink-0 rounded-lg object-cover" />
        <div className="flex-1 min-w-0">
          <p className="line-clamp-1 font-semibold">{car.name}</p>
          <p className="text-xs text-gray-500">
            <Users size={11} className="mr-0.5 inline" /> {car.seatCapacity} seats · {car.type}
          </p>
          <p className="mt-1 font-bold text-brand-600">${car.dailyPrice}/day</p>
          {car.available ? (
            <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              Available
            </span>
          ) : (
            <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              Unavailable
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
        <Link href={`/cars/${car._id}`} className="btn-outline flex-1 !py-1.5 !text-xs">
          <Eye size={14} /> View
        </Link>
        <Link href={`/my-cars/${car._id}/edit`} className="btn-outline flex-1 !py-1.5 !text-xs">
          <Pencil size={14} /> Edit
        </Link>
        <button
          onClick={onDelete}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/40"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
