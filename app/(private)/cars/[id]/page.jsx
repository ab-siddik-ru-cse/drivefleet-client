import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { apiServer } from "@/lib/api";
import CarDetailsClient from "./CarDetailsClient";

export default async function CarDetailsPage({ params }) {
  const cookieHeader = cookies().toString();

  const [carData, sessionData] = await Promise.all([
    apiServer(`/api/cars/${params.id}`),
    apiServer("/api/session/me", cookieHeader),
  ]);

  if (!carData?.car) notFound();

  return <CarDetailsClient car={carData.car} currentUser={sessionData?.user ?? null} />;
}
