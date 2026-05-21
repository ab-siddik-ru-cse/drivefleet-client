import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { apiServer } from "@/lib/api";
import CarDetailsClient from "./CarDetailsClient";

/**
 * Server-side: fetches the public car details + the current user (if any).
 * Same-origin cookies (via proxy) make this work — cookies() returns the
 * auth cookies and we forward them to the Express server.
 */
export default async function CarDetailsPage({ params }) {
  const cookieHeader = cookies().toString();

  const [carData, sessionData] = await Promise.all([
    apiServer(`/api/cars/${params.id}`),
    apiServer("/api/session/me", cookieHeader),
  ]);

  if (!carData?.car) notFound();

  return <CarDetailsClient car={carData.car} currentUser={sessionData?.user ?? null} />;
}
