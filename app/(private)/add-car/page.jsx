"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CarForm from "@/components/CarForm";
import { api } from "@/lib/api";

export default function AddCarPage() {
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      await api("/api/cars", { method: "POST", body: values });
      toast.success("Car added successfully!");
      router.push("/my-cars");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not create car.");
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add a Car</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">List your vehicle for rent on DriveFleet.</p>
      </div>
      <div className="card">
        <CarForm submitLabel="Add Car" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}