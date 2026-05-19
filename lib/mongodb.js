import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to your .env file.");
}

const options = {};

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev, reuse a single client across hot reloads.
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db("drivefleet");
}

export default clientPromise;
