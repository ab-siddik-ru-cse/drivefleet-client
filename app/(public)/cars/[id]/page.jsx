import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { apiServer } from "@/lib/api";
import CarDetailsClient from "./CarDetailsClient";

export default async function CarDetailsPage({ params }) {
  // Forward cookies so the server can recognize the user (for "is owner?" checks).
  const cookieHeader = cookies().toString();

  // Parallel fetch: car details (public) + current user (needs cookies).
  const [carData, sessionData] = await Promise.all([
    apiServer(`/api/cars/${params.id}`),
    apiServer("/api/session/me", cookieHeader),
  ]);

  if (!carData?.car) notFound();

  return <CarDetailsClient car={carData.car} currentUser={sessionData?.user ?? null} />;
}
