import { notFound } from "next/navigation";
import { apiServer } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import CarDetailsClient from "./CarDetailsClient";

async function getCar(id) {
  try {
    const { car } = await apiServer(`/api/cars/${id}`);
    return car;
  } catch (err) {
    if (err.status === 404) return null;
    console.error("[car details] fetch failed:", err.message);
    return null;
  }
}

export default async function CarDetailsPage({ params }) {
  const [car, currentUser] = await Promise.all([getCar(params.id), getCurrentUser()]);
  if (!car) notFound();
  return <CarDetailsClient car={car} currentUser={currentUser} />;
}