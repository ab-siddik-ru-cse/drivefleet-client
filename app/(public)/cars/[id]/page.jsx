import { notFound } from "next/navigation";
import { apiServer } from "@/lib/api";
import CarDetailsClient from "./CarDetailsClient";

export const dynamic = "force-dynamic";

export default async function CarDetailsPage({ params }) {
  const carData = await apiServer(`/api/cars/${params.id}`);
  if (!carData?.car) notFound();

  return <CarDetailsClient car={carData.car} />;
}