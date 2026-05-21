import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiServer } from "@/lib/api";

/**
 * Server-side auth guard for the (private) route group.
 *
 * Now works perfectly because the Next.js proxy keeps everything same-origin:
 * the auth cookies are stored on THIS domain, so cookies() can read them
 * and we can forward them to the Express server for verification.
 *
 * No spinner flash, no client-side check needed — the page either renders
 * straight away or the user is redirected to login before render.
 */
export default async function PrivateLayout({ children }) {
  const cookieHeader = cookies().toString();
  const data = await apiServer("/api/session/me", cookieHeader);

  if (!data?.user) {
    redirect("/login");
  }
  return <>{children}</>;
}
