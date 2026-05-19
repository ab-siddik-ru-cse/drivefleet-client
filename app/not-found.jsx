import Link from "next/link";
import { Car, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-500">
        <Car size={36} />
      </span>
      <h1 className="text-5xl font-extrabold md:text-6xl">404</h1>
      <p className="mt-3 text-xl font-semibold">This road leads nowhere</p>
      <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
        The page you&apos;re looking for has been moved, renamed, or never existed.
      </p>
      <Link href="/" className="btn-primary mt-6">
        <Home size={16} /> Take me home
      </Link>
    </div>
  );
}
