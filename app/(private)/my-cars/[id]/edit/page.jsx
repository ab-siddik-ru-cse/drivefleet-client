"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import CarForm from "@/components/CarForm";
import Spinner from "@/components/Spinner";
import { api } from "@/lib/api";

export default function EditCarPage() {
  const router = useRouter();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api(`/api/cars/${id}`);
        if (cancelled) return;
        setCar(data.car);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        toast.error(err.message || "Could not load car.");
        setCar(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      // PATCH on drivefleet-server enforces owner-only via requireAuth + check.
      await api(`/api/cars/${id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      toast.success("Car updated.");
      router.push("/my-cars");
      router.refresh();
    } catch (err) {
      console.error(err);
      if (err.status === 403) setForbidden(true);
      toast.error(err.message || "Could not update car.");
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-10"><Spinner /></div>;
  }

  if (forbidden) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Not your car</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          You can only edit cars you&apos;ve listed yourself.
        </p>
        <Link href="/my-cars" className="btn-primary mt-4">Back to My Cars</Link>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Car not found</h1>
        <Link href="/my-cars" className="btn-primary mt-4">Back to My Cars</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/my-cars"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-400"
      >
        <ArrowLeft size={16} /> Back to My Cars
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Car</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Update the details of your listing.</p>
      </div>
      <div className="card">
        <CarForm initial={car} submitLabel="Save Changes" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
