import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import CarDetailsClient from "./CarDetailsClient";

async function getCar(id) {
  try {
    const _id = new ObjectId(id);
    const db = await getDb();
    const doc = await db.collection("cars").findOne({ _id });
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString(), createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt };
  } catch {
    return null;
  }
}

export default async function CarDetailsPage({ params }) {
  const [car, currentUser] = await Promise.all([getCar(params.id), getCurrentUser()]);
  if (!car) notFound();
  return <CarDetailsClient car={car} currentUser={currentUser} />;
}
