"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import CarForm from "@/components/CarForm";
import Spinner from "@/components/Spinner";

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
        const res = await fetch(`${process.env.API_URL}/cars/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          toast.error(data.error || "Could not load car.");
          setCar(null);
        } else {
          setCar(data.car);
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      const res = await fetch(`${process.env.API_URL}/cars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) setForbidden(true);
        toast.error(data.error || "Could not update car.");
        return;
      }
      toast.success("Car updated.");
      router.push("/my-cars");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Network error.");
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
